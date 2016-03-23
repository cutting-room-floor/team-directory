import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { colN } from '../../utils';

export default class Add extends Component {

  constructor() {
    super();
    this.change = this.change.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  change(e) {
    const { onChange, id, value } = this.props;
    const fields = ReactDOM.findDOMNode(this.refs.node).getElementsByTagName('div');
    const group = [];

    Array.prototype.forEach.call(fields, (el) => {
      const item = el.getElementsByTagName('input');
      const pairings = [];

      // Name/Value pairings
      Array.prototype.forEach.call(item, (itm) => {
        pairings.push(itm.value);
      });

      if (pairings[0] || pairings[1]) {
        group.push({
          name: pairings[0],
          value: pairings[1]
        });
      }
    });

    onChange(id, group);
  }

  add(e) {
    e.preventDefault();
    const { onChange, id, value } = this.props;
    let group = value ? value : [];
    group.push({name: '', value: ''});
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
    const { id, value } = this.props;
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
            className='col6'
            name={id}
            placeholder='Name'
            value={field.name}
            onChange={this.change}
          />
          <input
            type='text'
            name={id}
            className='col6'
            placeholder='Value'
            value={field.value}
            onChange={this.change}
          />
        </div>
      );
    }.bind(this);

    return (
      <fieldset ref='node'>
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

Add.propTypes = {
  id: PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array
  ]),
  onChange: PropTypes.func.isRequired
}
