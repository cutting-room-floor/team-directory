import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Native extends Component {

  constructor() {
    super();
    this.change = this.change.bind(this);
  }

  change(e) {
    const { onChange, id } = this.props;
    onChange(id, e.target.value);
  }

  render() {
    const { placeholder, required, type, value } = this.props;
    return (
      <input
        type={type}
        className={`col12 ${type}`}
        placeholder={placeholder}
        required={required}
        onChange={this.change}
        value={value}
      />
    );
  }
}

Native.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool
}
