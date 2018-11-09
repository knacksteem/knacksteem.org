import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout, Card, Icon } from 'antd';
import {Link} from 'react-router-dom';
import './index.css';

const styles = {
  barIcon: {
    fontSize: '16px',
    color: '#999',
  }
};

const AnnouncementMetaBar = (props) => {

  return (
    <div className="contribution-bar ">
      <Layout style={{ backgroundColor: '#fff' }}>
        <div className="profile-info-bar-container" style={{width: '200px'}}>  
          <h3 className="profile-info-bar-title">Announcement</h3>
          <Card style={{margin: '15px'}}>
            <h4>Welcome to the Announcement</h4>
            <p>
            ​ Lorem ipsum dolor sit amet, ex eius nostrum cum, ut insolens sensibus quo. 
            </p>
            <Link to="/">Read more <Icon type="arrow-right" theme="outlined" /></Link>
          </Card>
          <div style={{width: '170px', margin: '15px'}} >
           <Button style={{width: 'inherit', backgroundColor: '#22429d'}} type="primary">Show All</Button>
          </div>
        </div>
      </Layout>
    </div>
  );
};


export default AnnouncementMetaBar;