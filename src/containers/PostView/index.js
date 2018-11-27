import React from 'react';
import ArticleDetail from './../ArticleDetail';
import {Row, Col} from 'antd'
import AnouncementMetaBar  from '../../components/AnnouncementMetaBar';

const PostView = () => {
    return (
        <Row style={{width: '75%'}}>
            <Row>
                <Col>
                    <ArticleDetail/>
                </Col>
            </Row>
            <Row style={{width: '33%'}}>
                <Col>
                    <AnouncementMetaBar/>
                </Col>
            </Row>
        </Row>
    ) 
}

export default PostView;