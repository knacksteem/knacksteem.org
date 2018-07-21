import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Modal, Input, DatePicker} from 'antd';
import {moderateUser} from '../../actions/stats';
import './ModButtons.css';

/**
 * buttons for moderation, only visible to moderators and supervisors
 */
class ModButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBanModal: false,
      banReason: '',
      bannedUntil: '',
      showModalError: false
    };
  }
  onMakeSupervisorClick = () => {
    const {dispatch, item} = this.props;
    dispatch(moderateUser(item.username, 'addSupervisor'));
  };
  onRemoveSupervisorClick = () => {
    const {dispatch, item} = this.props;
    dispatch(moderateUser(item.username, 'removeSupervisor'));
  };
  onMakeModClick = () => {
    const {dispatch, item} = this.props;
    dispatch(moderateUser(item.username, 'addModerator'));
  };
  onRemoveModClick = () => {
    const {dispatch, item} = this.props;
    dispatch(moderateUser(item.username, 'removeModerator'));
  };
  //this just opens the modal, where you can enter a reason for the ban and an end date
  onBanClick = () => {
    this.setState({
      showBanModal: true
    });
  };
  onBanOkClick = () => {
    const {banReason, bannedUntil} = this.state;
    const {dispatch, item} = this.props;

    //ban can only happen with a reason and an end date
    if (!banReason.length || !bannedUntil) {
      this.setState({
        showModalError: true
      });
      return;
    }

    dispatch(moderateUser(item.username, 'ban', banReason, bannedUntil));

    this.setState({
      showBanModal: false,
      banReason: '',
      bannedUntil: '',
      showModalError: false
    });
  };
  onBanCancelClick = () => {
    this.setState({
      showBanModal: false,
      banReason: '',
      bannedUntil: '',
      showModalError: false
    });
  };
  handleBanReasonInput = (e) => {
    this.setState({
      banReason: e.target.value,
      showModalError: false
    });
  };
  handleBannedUntilInput = (momentDatetime) => {
    if (momentDatetime) {
      this.setState({
        bannedUntil: momentDatetime.unix(),
        showModalError: false
      });
    }
  };
  render() {
    const {showBanModal, banReason, showModalError} = this.state;
    const {user, item} = this.props;

    return (
      <div className="mod-buttons">
        {(user.username === 'knowledges' && item.roles.indexOf('supervisor') === -1) && <Button type="primary" size="small" onClick={this.onMakeSupervisorClick}>Make Supervisor</Button>}
        {(user.username === 'knowledges' && item.roles.indexOf('supervisor') !== -1) && <Button type="primary" size="small" onClick={this.onRemoveSupervisorClick}>Remove Supervisor</Button>}
        {(user.isSupervisor && item.roles.indexOf('moderator') === -1) && <Button type="primary" size="small" onClick={this.onMakeModClick}>Make Mod</Button>}
        {(user.isSupervisor && item.roles.indexOf('moderator') !== -1) && <Button type="primary" size="small" onClick={this.onRemoveModClick}>Remove Mod</Button>}
        {(user.isModerator && !item.isBanned) && <Button type="primary" size="small" onClick={this.onBanClick}>Ban</Button>}
        <Modal
          title="Ban User"
          visible={showBanModal}
          onOk={this.onBanOkClick}
          onCancel={this.onBanCancelClick}
        >
          <div className="mod-modal-input"><Input placeholder="Reason" value={banReason} onChange={this.handleBanReasonInput} /></div>
          <div className="mod-modal-input"><DatePicker onChange={this.handleBannedUntilInput} /></div>
          {showModalError && <div className="mod-modal-error">Reason and End Date have to be entered!</div>}
        </Modal>
      </div>
    );
  }
}

ModButtons.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  item: PropTypes.object //holds the data of the current user to moderate
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(connect(mapStateToProps)(ModButtons));
