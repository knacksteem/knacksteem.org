import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import PropTypes from 'prop-types';
import qs from 'qs';
import {userLogin} from '../../actions/user';

class Callback extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    const {location, dispatch} = this.props;
    dispatch(userLogin(qs.parse(location.search)['?access_token']));
  }
  componentDidUpdate(prevProps, prevState) {
    const {user, dispatch} = this.props;

    if (prevProps.user.username !== user.username) {
      //redirect to homepage
      dispatch(push('/'));
    }
  }
  render() {
    return (
      <div>
        Logging in...
      </div>
    );
  }
}

Callback.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(connect(mapStateToProps)(Callback));
