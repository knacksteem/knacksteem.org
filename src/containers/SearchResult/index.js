import React from 'react';
import {connect} from 'react-redux';
import {Layout, Spin} from "antd";
import ArticleListItem from '../../components/ArticleListItem';
const { Content} = Layout;

class SearchResult extends React.Component {
    constructor (props) {
        super(props);
    }

    render(){
        const {articles} = this.props; 
        return (
            <div id="home-body">
        <Layout id="home-articles">
          <Content>
            <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" >
              {articles.data.map((data) => {
                return (
                  <ArticleListItem key={data.permlink} data={data} onUpvoteSuccess={this.loadArticles} />
                );
              })}
            </div>
            {articles.isBusy && <Spin/>}
          </Content>
        </Layout>
      </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        articles: state.articles,
    }
}
export default connect(mapStateToProps)(SearchResult);