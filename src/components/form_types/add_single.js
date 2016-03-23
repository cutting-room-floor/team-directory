import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class AddSingle extends Component {

  constructor() {
    super();
    this.change = this.change.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  change(e) {
    const { onChange, id, value } = this.props;
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    let group = value ? value : [];
    group = group.map((d, i) => {
      if (i === index) d = e.target.value;
      return d;
    });
    onChange(id, group);
  }

  add(e) {
    e.preventDefault();
    const { onChange, id, value } = this.props;
    let group = value ? value : [];
    group.push('');
    onChange(id, group);
  }

  remove(e) {
    e.preventDefault();
    const { onChange, id, value } = this.props;
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    let group = value ? value : [];
    group = group.filter((_, i) => i !== index);
    onChange(id, group);
  }

  render() {
    const { id, value, placeholder } = this.props;
    const addToList = function(field, i) {
      return (
        <div
          key={i}
          className='col12 clearfix contain'
          style={{
            marginBottom: '2px',
            paddingRight: '40px'
          }}>
          <button
            name={id}
            data-index={i}
            style={{width: '40px'}}
            onClick={this.remove}
            className='icon close pin-right round-right button'
          />
          <input
            type='text'
            name={id}
            data-index={i}
            className='col12'
            placeholder={placeholder}
            value={field}
            onChange={this.change}
          />
        </div>
      );
    }.bind(this);

    return (
      <fieldset>
        {value.length && value.map(addToList)}
        <button
          name={id}
          onClick={this.add}
          className='button icon plus col12'>
          Add
        </button>
      </fieldset>
    );
  }
}

AddSingle.propTypes = {
  id: PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array
  ]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}
