import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Textarea extends Component {

  constructor() {
    super();
    this.change = this.change.bind(this);
  }

  change(e) {
    const { onChange, id } = this.props;
    onChange(id, e.target.value);
  }

  render() {
    const { placeholder, required, value } = this.props;
    return (
      <textarea
        className='col12'
        placeholder={placeholder}
        required={required}
        onChange={this.change}
        value={value}
      />
    );
  }
}

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  required: PropTypes.bool
}
