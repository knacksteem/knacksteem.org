import React from 'react';
import PropTypes from 'prop-types';
import SingleComment from './SingleComment';
import './index.css';

//stateless component for article comments
const Comments = ({data}) => {
  return (
    <div>
      {data.map((elem) => {
        return (
          <SingleComment key={elem.permlink} data={elem} />
        );
      })}
    </div>
  );
};

Comments.propTypes = {
  data: PropTypes.array //array of comments
};

export default Comments;
