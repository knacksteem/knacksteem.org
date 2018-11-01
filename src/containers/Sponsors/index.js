import React, { Component } from 'react';
import './index.css';
import steem from 'steem';
import Sponsor from '../../components/Sponsor/';
export default class Sponsors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: [],
      sponsors: []
    };
  }
  async componentDidMount() {
    let globalData = [];
    let arr = [];
    //getting history of an account TODO: Get whole history to get every delegator.
    await this.getData();
    //filtering to get only delegations
    const filtered = this.state.temp.filter(op => {
      return op[1].op[0] === 'delegate_vesting_shares';
    });
    filtered.map(sponsor => {
      let obj = {
        delegator: sponsor[1].op[1].delegator,
        vesting_shares: Number(sponsor[1].op[1].vesting_shares.split(' ')[0]),
        block: sponsor[1].block,
        trx_id: sponsor[1].trx_id
      };
      //checking if delegator already exists in array
      const check = arr.find(x => x.delegator === obj.delegator);
      if(check !== undefined) {

        if(check.block < sponsor[1].block) {
          //if delegation is newer it will replace the old one
          const filtered = arr.filter(item => {
            return item.trx_id !== check.trx_id;
          });
          arr = filtered;
          arr.push(obj);
        }
      } else {
        arr.push(obj);
      }

    });
    //deleting delegations with zero vests
    const filterZeroVesting = arr.filter(item => {
      return item.vesting_shares !== 0;
    });

    const sorted = filterZeroVesting.sort(function(a, b){
      const x = a.vesting_shares;
      const y = b.vesting_shares;
      if (x < y) {return 1;}
      if (x > y) {return -1;}
      return 0;
    });
    //Getting global blockchain data to convert vests to STEEM
    await steem.api.getDynamicGlobalPropertiesAsync().then(result => {
      globalData.push(result);
      return null;
    }).catch(err =>{
      return err;
    });
    this.setState({
      sponsors: sorted,
      globalData: globalData
    });
  }
  async getData() {
    let data;
    //Number of the operation, it has to be the same or higher than limit
    let from = this.state.temp === undefined || this.state.temp.length === 0 ? 10000000 : this.state.temp[this.state.temp.length -1 ][0];
    await steem.api.getAccountHistoryAsync('knacksteem.org', from, from < 1000 ? from : 1000).then(res => {
      const sorted = res.sort(function(a, b){
        const x = a[1].block;
        const y = b[1].block;
        if (x < y) {return 1;}
        if (x > y) {return -1;}
        return 0;
      });
      data = sorted;
      return res;
    }).catch(err => {
      return err;
    });
    if(this.state.temp.length === 0) {
      this.setState({
        temp: data
      });
      await this.getData();
      return null;
      //if pulled data is the same function stops here
    } else if(data[data.length - 1][1].block === this.state.temp[this.state.temp.length -1][1].block) {
      return null;
    } else {
      const newState = this.state.temp.concat(data);
      this.setState({
        temp: newState
      });
      await this.getData();
      return null;
    }

  }
  render() {
    return (
      <div className="sponsors-container">
        <h1 className="sponsors-h1">Sponsors</h1>
        <p className="sponsors-about">Aenean gravida tellus purus, ac tincidunt dolor sodales ornare. Duis et nunc porta, auctor ligula accumsan, viverra justo. Vestibulum tempus ornare elit. Nullam id malesuada lectus, quis pharetra felis. Aliquam et vehicula arcu. </p>

        <div className="sponsors-data-container">
          {this.state.sponsors.map(sponsor => {

            return <Sponsor key={sponsor.delegator} data={sponsor}
              total_vesting_shares={this.state.globalData[0].total_vesting_shares}
              total_vesting_fund_steem={this.state.globalData[0].total_vesting_fund_steem}/>;
          })}
        </div>
      </div>
    );
  }
}
