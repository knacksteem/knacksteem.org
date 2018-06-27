import React, {Component} from 'react';
import PropTypes from 'prop-types';

class StyleButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      props.onToggle(props.style);
    };
  }
  render() {
    const {active, label} = this.props;

    let className = 'RichEditor-styleButton';
    if (active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {label}
      </span>
    );
  }
}

StyleButton.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string.isRequired
};

export default StyleButton;
