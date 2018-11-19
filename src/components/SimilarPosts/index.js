import React from 'react';
import { Button, Layout, Card, Icon } from 'antd';
import {Link} from 'react-router-dom';
import './index.css';

const SimilarPosts = ({data, showMore, disableShowMore}) => {

	return (
    <div className="contribution-bar ">
      <Layout style={{ backgroundColor: '#fff' }}>
        <div className="profile-info-bar-container" style={{width: '200px'}}>  
          <h3 style={{textAlign: 'left'}} className="column-title">Similar posts</h3>
          {data.map((similarPost) => {
          	return (
		          <Card key={similarPost.permlink} style={{margin: '15px'}}>
                {similarPost.coverImage && <div className="similarPostImg" 
                      style={{backgroundImage: `url(https://steemitimages.com/100x100/${similarPost.coverImage})`}}>
                </div>}
		            <h4 style={{textAlign: 'center'}}>{similarPost.title}</h4>
		            <p>{similarPost.description}</p>
		            <Link to={`/articles/${similarPost.author}/${similarPost.permlink}`}>Read more <Icon type="arrow-right" theme="outlined" /></Link>
		          </Card>
        		);
          })}
          <div style={{width: '170px', margin: '15px'}} >
            <Button onClick={showMore} disabled={disableShowMore} style={{width: 'inherit', backgroundColor: '#22429d'}} type="primary">Show more</Button>
          </div>
        </div>
      </Layout>
    </div>
  
	);
};


export default SimilarPosts;