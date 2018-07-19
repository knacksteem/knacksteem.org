import React from 'react';
import PropTypes from 'prop-types';
import SingleComment from './SingleComment';
import './index.css';

//stateless component for article comments
const Comments = ({data, onUpdate, parentPermlink, parentAuthor}) => {
  return (
    <div>
      {data.map((elem) => {
        return (
          <SingleComment key={elem.permlink} data={elem} parentPermlink={parentPermlink} parentAuthor={parentAuthor} onUpdate={onUpdate} />
        );
      })}
    </div>
  );
};

Comments.propTypes = {
  data: PropTypes.array, //array of comments
  onUpdate: PropTypes.func.isRequired,
  parentPermlink: PropTypes.string.isRequired,
  parentAuthor: PropTypes.string.isRequired
};

export default Comments;
