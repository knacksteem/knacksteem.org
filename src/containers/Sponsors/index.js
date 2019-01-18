import React, { Component } from 'react';
import './index.css';
import steem from 'steem';
import axios from 'axios';
import Sponsor from '../../components/Sponsor/';

export default class Sponsors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsors: []
    };
  }
  async componentDidMount() {
    let json = [];
    let globalData = [];
    //Put your api endpoint here
    axios.get('./get_steem_delegations/delegations.json').then(res => {
      json = res.data;
      return res;
    }).catch(err => {
      console.log(err);
    });

    //Getting global blockchain data to convert vests to STEEM
    await steem.api.getDynamicGlobalPropertiesAsync().then(result => {
      globalData.push(result);
      return null;
    }).catch(err =>{
      return err;
    });
    this.setState({
      sponsors: json,
      globalData: globalData
    });
  }

  render() {
    return (
      <div className="sponsors-container">
        <div className="sponsors-flex-container">
          <h1 className="sponsors-h1">Sponsors</h1>
          <p className="sponsors-about">Welcome to knacksteem sponsor's page. KnackSteem sponsors are the supporter of the project who have delegated some Steem power to the project to increase our voting strength. These will increase our contributor's potential rewards. Sponsors are eligible for 12% reward from all the post made through our front-end.</p>

          <div className="sponsors-data-container">
            {this.state.sponsors.map(sponsor => {

              return <Sponsor key={sponsor.delegator} data={sponsor}
                total_vesting_shares={this.state.globalData[0].total_vesting_shares}
                total_vesting_fund_steem={this.state.globalData[0].total_vesting_fund_steem}/>;
            })}
          </div>
        </div>
      </div>
    );
  }
}
