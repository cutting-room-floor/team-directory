import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { colN } from '../../utils';

export default class Radio extends Component {

  constructor() {
    super();
    this.change = this.change.bind(this);
  }

  change(e) {
    const { onChange, id } = this.props;
    const obj = {};
    let val = e.target.id.replace(id + '-', '');
    if (val === 'true') val = true;
    if (val === 'false') val = false;
    onChange(id, val);
  }

  render() {
    const { id, fields, value } = this.props;
    const renderFields = function(field, i) {
      const n = colN(fields.length);
      return (
        <div className={`react set${n}`} key={i}>
          <input
            type='radio'
            name={id}
            id={`${id}-${field.key}`}
            defaultChecked={value.toString() === field.key.toString()}
            onChange={this.change}
          />
          <label
            htmlFor={`${id}-${field.key}`}
            className={`button icon check col${n}`}>
            {field.label}
          </label>
        </div>
      );
    }.bind(this);

    return (
      <fieldset className='radio-pill pill clearfix col12'>
        {fields.map(renderFields)}
      </fieldset>
    );
  }
}

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  onChange: PropTypes.func.isRequired
}
