import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, InputNumber, Modal } from 'antd';

const styles = {
  BanReasonInputContainer: {
    marginBottom: '10px'
  },
  BanDurationInputContainer: {
    marginBottom: '5px',
    display: 'block'
  }
};

/**
 * Creates a ban modal invokable externally.
 * 
 * @param {String} name                        -  Name of the user.
 * @param {Boolean} isVisible                  -  Modal visibility status.
 * @param {Function} onCloseBanModal           -  Called when modal is dismissed.
 * @param {Function} onBanDurationInputChange  -  Called when the ban duration input changes.
 * @param {Function} onBanReasonInputChange    -  Called when the ban reason input changes.
 * @param {Function} onSubmitBanModal          -  Called when the ban submit button is clicked.
 * @param {Boolean} isBanSubmitDisabled        -  Ban submit disabled.
 */
const BanModal = ({
  name,
  isVisible,
  onCloseBanModal,
  onBanDurationInputChange,
  onBanReasonInputChange,
  onSubmitBanModal,
  isBanSubmitDisabled
}) => {
  return (
    <Modal
      visible={isVisible}
      title={`Really Ban ${name}?`}
      onOk={onSubmitBanModal}
      onCancel={onCloseBanModal}
      footer={[
        <Button key="back" onClick={onCloseBanModal}>Cancel</Button>,
        <Button
          key="submit"
          disabled={isBanSubmitDisabled}
          type="primary"
          onClick={() => onSubmitBanModal()}
        >
          Ban Kay
        </Button>,
      ]}
    >
      <div style={styles.BanReasonInputContainer}>
        <label style={styles.BanDurationInputContainer}>Ban reason (minimum of ten words).</label>
        <Input.TextArea
          onChange={e => onBanReasonInputChange(e)}
          rows={4}
        />
      </div>

      <div>
        <label style={styles.BanDurationInputContainer}>Ban duration (in hours)</label>
        <InputNumber
          onChange={e => onBanDurationInputChange(e)}
          min={1}
          defaultValue={1000}
        />
      </div>
    </Modal>
  );
};

BanModal.propTypes = {
  isBanSubmitDisabled: PropTypes.bool,
  isVisible: PropTypes.bool,
  banReason: PropTypes.string,
  name: PropTypes.string,
  onCloseBanModal: PropTypes.func,
  onBanDurationInputChange: PropTypes.func,
  onBanReasonInputChange: PropTypes.func,
  onSubmitBanModal: PropTypes.func
};

BanModal.defaultProps = {
  isBanSubmitDisabled: false,
  isVisible: false
};

BanModal.displayName = 'BanModal';

export default BanModal;