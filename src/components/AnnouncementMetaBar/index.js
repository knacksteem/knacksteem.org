import React, { Component } from 'react';
import { Button, Layout, Card, Icon } from 'antd';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import './index.css';
import Config from '../../config';
import {apiGet} from '../../services/api';

export default class AnnouncementMetaBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcementPost: []
    };
  }

  onClick() {
    window.location = `/@${Config.officialAccount}`
  }

  componentDidMount() {
    this.getAnnoncementPost();
  };

  // Getting the latest single post from KnackSteem Original Account 
  getAnnoncementPost = async () => {
    let announcementPosts = await apiGet(`/posts`, {author : `${Config.officialAccount}`, limit: 1});
    this.setState({
      announcementPost: announcementPosts.data ? announcementPosts.data.results : []
    });
  }

  render() {
    const {announcementPost} = this.state;
    return (
      <div className="contribution-bar " style={{width: '200px'}}>
        <Layout style={{ backgroundColor: '#fff' }}>
          <div className="profile-info-bar-container" style={{width: '200px'}}>  
            <h3 style={{textAlign: 'left'}} className="column-title">Announcement</h3>
            {announcementPost.map((announcementPost) => {
              return (
                <Card key={announcementPost.permlink} style={{margin: '15px'}}>
                  {announcementPost.coverImage && <div className="similarPostImg" 
                        style={{backgroundImage: `url(https://steemitimages.com/100x100/${announcementPost.coverImage})`}}>
                  </div>}
                  <h4 style={{textAlign: 'center', wordBreak: 'break-all'}}>{announcementPost.title}</h4>
                  <p style={{wordBreak: 'break-all'}}>{announcementPost.description.substr(0, 30)}</p>
                  <Link to={`/articles/${announcementPost.author}/${announcementPost.permlink}`}>Read more <Icon type="arrow-right" theme="outlined" /></Link>
                </Card>
              );
            })}
            <div style={{width: '170px', margin: '15px'}} >
              <Button onClick={this.onClick} style={{width: 'inherit', backgroundColor: '#22429d'}} type="primary">Show All</Button>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}

AnnouncementMetaBar.propTypes = {
  data: PropTypes.object
};