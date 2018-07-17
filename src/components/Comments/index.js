import React from 'react';
import PropTypes from 'prop-types';
import SingleComment from './SingleComment';
import './index.css';

//stateless component for article comments
const Comments = ({data, onUpdate}) => {
  return (
    <div>
      {data.map((elem) => {
        return (
          <SingleComment key={elem.permlink} data={elem} onUpdate={onUpdate} />
        );
      })}
    </div>
  );
};

Comments.propTypes = {
  data: PropTypes.array, //array of comments
  onUpdate: PropTypes.func.isRequired
};

export default Comments;
