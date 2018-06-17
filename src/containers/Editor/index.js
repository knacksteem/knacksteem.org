import React, { Component } from 'react';
import {Editor, EditorState, RichUtils } from 'draft-js';
import './index.css';

class myEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }

  render() {
    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />

      </div>
    );
  }
}

export default myEditor;
