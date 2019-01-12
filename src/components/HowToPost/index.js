import React from 'react';
import { Card, Layout } from 'antd';

const { Meta } = Card;

export const HowToPost = () => {
    return (
    <div className="how-to-post  ">
      <Layout style={{ backgroundColor: '#fff' }}>
        <div className="profile-info-bar-container" style={{width: '200px'}}>  
          <h3 style={{textAlign: 'center'}} className="how-to-post-title">How to Post</h3>
          <Card
            hoverable
            style={{ width: 200 }}
          >
          <img alt="video for knacksteem" style={{width: '100%'}} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
            <Meta
                title="Posting On KnackSteem"
                description="www.knacksteem.org"
            />
          </Card>
        </div>
      </Layout>
    </div>
    )
}