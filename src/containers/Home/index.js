import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import './index.css';
import sc2 from 'sc2-sdk';
import { Layout, Input, List } from 'antd';
import Article from '../../components/Article';
const { Header, Content } = Layout;
const Search = Input.Search;

const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'http://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
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
      <div className="App">
        <Header>
          <Search
            placeholder="Search through Knacksteem"
            onSearch={value => console.log(value)}
            style={{ width: 300 }}
          />
        </Header>
        <Content>
          {/*{this.props.location.pathname}*/}
          <List
            itemLayout="vertical"
            size="large"
            dataSource={listData}
            renderItem={data => <Article data={data} />}
          />
        </Content>
        {/*<a href={this.getOathURL()}>Login</a>*/}
      </div>
    );
  }
}

export default withRouter(Home);
