import React from 'react';
import ArticleDetail from './../ArticleDetail';
import {Row, Col} from 'antd'
import AnouncementMetaBar  from '../../components/AnnouncementMetaBar';
import './index.css';

const PostView = () => {
    return (
        <Row type="flex" style={{width: '75%'}}>
            <Row className="article-container" style={{width: '67%'}}>
                <Col>
                    <ArticleDetail/>
                </Col>
            </Row>
            <Row type="flex" justify="center" style={{width: '33%'}}>
                <Col className="announcement-container" >
                    <AnouncementMetaBar/>
                </Col>
            </Row>
        </Row>
    ) 
}

export default PostView;