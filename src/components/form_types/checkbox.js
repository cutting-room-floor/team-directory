import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { colN } from '../../utils';

export default class Checkbox extends Component {

  constructor() {
    super();
    this.change = this.change.bind(this);
  }

  change(e) {
    const { onChange, id, value } = this.props;
    const checked = value ? value : [];
    const v = e.target.id.replace(id + '-', '');
    const index = checked.indexOf(v);

    if (index > -1) {
      checked.splice(index, 1);
    } else {
      checked.push(v);
    }

    onChange(id, checked);
  }

  render() {
    const { id, fields, value } = this.props;

    const renderFields = function(field, i) {
      const n = colN(fields.length);
      return (
        <div className={`react set${n}`} key={i}>
          <input
            type='checkbox'
            name={id}
            id={`${id}-${field.key}`}
            defaultChecked={value.indexOf(field.key) > -1}
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
      <fieldset className='checkbox-pill pill clearfix col12'>
        {fields.map(renderFields)}
      </fieldset>
    );
  }
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array
  ]),
  fields: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}
