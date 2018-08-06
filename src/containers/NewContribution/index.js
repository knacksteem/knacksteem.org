import React from 'react';
import {Layout} from 'antd';
import Editor from '../../components/Editor';
import './index.css';
const {Content} = Layout;

/**
 * Route for adding a new article/contribution with rich text editor
 */
const NewContribution = () => {
  return (
    <div className="editor">
      <Content style={{minHeight: 1080}}>
        <Editor isComment={false} isEdit={false} />
      </Content>
    </div>
  );
};

export default NewContribution;
