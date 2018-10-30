import React from 'react';
import {Layout, Row, Col} from 'antd';
import Editor from '../../components/Editor';
import './index.css';
const {Content} = Layout;

/**
 * Route for adding a new article/contribution with rich text editor
 */
const NewContribution = () => {
    return (
        <Row type="flex" justify="center" className="editor-container">
            <Col
                type="flex"
                style={{
                minHeight: '1080px',
                width: '90vw'
            }}>
                <Editor isComment={false} isEdit={false}/>
            </Col>
        </Row>
    );
};

export default NewContribution;
