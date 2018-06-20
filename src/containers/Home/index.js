import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './index.css';
import sc2 from 'sc2-sdk';
import {Layout, Input} from 'antd';
import ArticleListItem from '../../components/ArticleListItem';
const {Header, Content} = Layout;
const Search = Input.Search;

const listData = [];
for (let i = 1; i < 23; i++) {
  listData.push({
    title: 'Article Title',
    description: 'Ask for petting sleep, paw at your fat belly and eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap so somehow manage to catch a bird but have no idea what to do next, so play with it until it dies of shock, so while happily ignoring when being called need to chase tail. Curl up and sleep on the freshly laundered towels drool. Allways wanting food howl uncontrollably for no reason for pushes butt to face stinky cat and lick the plastic bag hopped up on catnip weigh eight pounds but take up a full-size bed. Spend six hours per day washing, but still have a crusty butthole trip on catnip or eat half my food and ask for more, stand with legs in litter box, but poop outside. Meow meow, i tell my human please stop looking at your phone and pet me, hate dog, and sniff all the things.'
  });
}

class Home extends Component {
  constructor({history, location}) {
    super();
  }
  getOathURL() {
    let api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: 'http://localhost:3000/callback',
      scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment']
    });
    return api.getLoginURL();
  }
  componentDidMount() {
    //TODO load data with redux action and fill store - connect this component to redux store to fill content element

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      //location change detected, load new data
      //TODO load data with redux action and fill store - connect this component to redux store to fill content element

    }
  }
  render() {
    return (
      <div>
        <Header>
          <Search
            placeholder="Search through Knacksteem"
            onSearch={value => console.log(value)}
            style={{ width: 300 }}
          />
        </Header>
        <Content>
          {/*{this.props.location.pathname}*/}
          <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={{display: 'flex', flexDirection: 'column'}}>
            {listData.map((data, index) => {
              return (
                <ArticleListItem key={index} data={data} />
              );
            })}
          </div>
        </Content>
        {/*<a href={this.getOathURL()}>Login</a>*/}
      </div>
    );
  }
}

export default withRouter(Home);
