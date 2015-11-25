import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import linkState from 'react-link-state';

export default class Form extends Component {
  constructor(props, context) {
    super(props, context);
    const { user, data } = this.props;
    this.state = this.mapUser(user, data);
  }

  componentWillReceiveProps(next) {
    const { user, data } = next;
    this.setState(this.mapUser(user, data));
  }

  mapUser(user, data) {
    return data.reduce((memo, section) => {
      section.data.forEach((field) => {
        memo[field.key] = (user && user[field.key]) ? user[field.key] : '';
      });
      return memo;
    }, {});
  }

  exists(value) {
    var { team } = this.props;
    return team.some((user) => {
      return user.github.toLowerCase() === value.toLowerCase();
    });
  }

  formData() {
    const { data } = this.props;
    let formData = [];

    for (const p in data) {
      formData = formData.concat(data[p].data);
    }
    return formData;
  }

  onDelete(e) {
    const { onDelete, user } = this.props;
    e.preventDefault();
    onDelete();
  }

  onSubmit(e) {
    e.preventDefault();
    const data = this.state;
    const { setError, onSubmit, user, validators, normalizers } = this.props;

    // - Check that GitHub username does not exist.
    if (this.exists(data.github) && !user) {
      return setError(`User ${data.github} already exists.`);
    }

    // - Check all the required fields.
    const missingRequired = this.formData().filter((d) => {
      return d.required;
    }).filter((d) => {
      let contains;

      for (let key in data) {
        let value;
        if (data[key] && data[d.key]) value = data[d.key];
        if (typeof value === 'string' && value ||
            typeof value === 'object' && value.length) contains = true;
      }

      return !contains;
    });

    if (missingRequired.length) {
      const requiredList = missingRequired.reduce((memo, req) => {
        memo.push('"' + req.label + '"');
        return memo;
      }, []).join(', ');

      return setError(`Missing required fields ${requiredList}`);
    }

    // Validate
    validators(data, (err) => {
      if (err) return setError(err);

      // Normalize
      for (const key in data) {

        // Remove unfilled values
        if (!data[key]) delete data[key];

        if (typeof data[key] === 'object') {

          // Object structures (provided by "Add" inputs).
          // Ensure a value was filled. Otherwise remove it.
          data[key] = data[key].filter((d) => {
            let hasValue;
            for (let prop in d) {
              if (d[prop]) hasValue = true;
            }
            return hasValue;
          });
        }
      }

      // Client normalization
      normalizers(data, (res) => {
        onSubmit(res); // Submit!
      });
    });
  }

  radioOnChange(e) {
    const obj = {};
    let val = e.target.id;
    if (val === 'true') val = true;
    if (val === 'false') val = false;
    obj[e.target.name] = val;
    this.setState(obj);
  }

  checkboxOnChange(e) {
    const group = ReactDOM.findDOMNode(this.refs[e.target.name]).getElementsByTagName('input');
    const checked = [];
    Array.prototype.forEach.call(group, (el) => {
      if (el.checked) checked.push(el.id);
    });

    const obj = {};
    obj[e.target.name] = checked;
    this.setState(obj);
  }

  addGroupOnChange(e) {
    const group = ReactDOM.findDOMNode(this.refs[e.target.name]).getElementsByTagName('div');
    const groupSet = [];

    Array.prototype.forEach.call(group, (el) => {
      const item = el.getElementsByTagName('input');
      const pairings = [];

      // Name/Value pairings
      Array.prototype.forEach.call(item, (itm) => {
        pairings.push(itm.value);
      });

      if (pairings[0] || pairings[1]) {
        groupSet.push({
          name: pairings[0],
          value: pairings[1]
        });
      }
    });

    const obj = {};
    obj[e.target.name] = groupSet;
    this.setState(obj);
  }

  addtoAddGroup(e) {
    e.preventDefault();
    const addGroup = this.state[e.target.name] ?
      this.state[e.target.name] : [];
    addGroup.push({name: '', value: ''});

    const obj = {};
    obj[e.target.name] = addGroup;
    this.setState(obj);
  }

  render() {
    const { data, actor, user, onDelete } = this.props;

    const colN = function(length) {
      if (length === 2) return 6;
      if (length === 3) return 4;
      if (length === 4) return 3;
      if (length > 4 || length === 1) return 12;
    };

    const renderRadioGroup = function(component, field, i) {
      const n = colN(this.fields.length);
      const labelClass = 'button icon check col' + n;
      const containerClass = 'react set' + n;
      return (
        <div className={containerClass} key={i}>
          <input
            type='radio'
            name={this.key}
            id={field.key}
            defaultChecked={component.state[this.key] === field.key}
            onChange={component.radioOnChange.bind(component)}
          />
          <label htmlFor={field.key} className={labelClass}>{field.label}</label>
        </div>
      );
    };

    const renderCheckGroup = function(component, field, i) {
      const n = colN(this.fields.length);
      const labelClass = 'button icon check col' + n;
      const containerClass = 'react set' + n;

      return (
        <div className={containerClass} key={i}>
          <input
            type='checkbox'
            name={this.key}
            id={field.key}
            defaultChecked={component.state[this.key].indexOf(field.key) > -1}
            onChange={component.checkboxOnChange.bind(component)}
          />
          <label htmlFor={field.key} className={labelClass}>{field.label}</label>
        </div>
      );
    };

    const renderAddGroup = function(component, field, i) {
      return (
        <div style={{marginBottom: '1px'}} className='col12 clearfix' key={i}>
          <input
            type='text'
            className='col6'
            name={this.key}
            placeholder='Name'
            defaultValue={field.name}
            onChange={component.addGroupOnChange.bind(component)}
          />
          <input
            type='text'
            name={this.key}
            className='col6'
            placeholder='Value'
            defaultValue={field.value}
            onChange={component.addGroupOnChange.bind(component)}
          />
        </div>
      );
    };

    const addFields = function(d, i) {
      const type = (d.type) ? d.type : 'text';
      const hidden = (type === 'hidden') ? 'hidden' : false;
      const defaultRenderer = (type === 'text' ||
                               type ==='date' ||
                               type === 'number');

      if (d.admin && !actor.admin) return;
      return (
        <fieldset id={d.key} key={i} className={`col6 pad1x ${hidden}`}>
          <label>{d.label} {d.required && <span className='question' title='Field is required'>*</span>}</label>
          {type === 'textarea' && <textarea
            className='col12'
            placeholder={d.label}
            required={d.required}
            valueLink={linkState(this, d.key)}
          />}
          {type === 'hidden' && <input
            type={type}
            className='hidden'
            valueLink={linkState(this, d.key)}
          />}
          {type === 'radio' && <fieldset
            className='radio-pill pill clearfix col12'>
            {d.fields.map(renderRadioGroup.bind(d, this))}
          </fieldset>}
          {type === 'checkbox' && <fieldset
            ref={d.key}
            className='checkbox-pill pill clearfix col12'>
            {d.fields.map(renderCheckGroup.bind(d, this))}
          </fieldset>}
          {type === 'add' && <fieldset ref={d.key}>
            {linkState(this, d.key).value && linkState(this, d.key).value.map(renderAddGroup.bind(d, this))}
            <button
              name={d.key}
              onClick={this.addtoAddGroup.bind(this)}
              className='button icon plus col12'>
              Add
            </button>
          </fieldset>}
          {defaultRenderer && <input
            type={type}
            className='col12'
            placeholder={d.label}
            required={d.required}
            valueLink={linkState(this, d.key)}
          />}
        </fieldset>
      );
    }.bind(this);

    const renderSection = function(section, i) {
      return (
        <fieldset className='fill-grey keyline-top pad1x pad4y' key={i}>
          <h2 className='block pad1x space-bottom1'>{section.section}</h2>
          <fieldset className='col12 clearfix'>
            {section.data.map(addFields)}
          </fieldset>
        </fieldset>
      );
    };

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        {data.map(renderSection)}
        <fieldset className='fill-light pad2 round-bottom clearfix quiet dark'>
          <div className='col8'>
            &nbsp;
            {user && <button
              className='button fill-red pad2x'
              onClick={this.onDelete.bind(this)}>
              Delete user
            </button>}
          </div>
          <div className='col4'>
            <input type='submit' className='button col12' />
          </div>
        </fieldset>
      </form>
    );
  }
}

Form.propTypes = {
  data: PropTypes.array.isRequired,
  setError: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  team: PropTypes.array.isRequired,
  actor: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  user: PropTypes.object,
  validators: PropTypes.func,
  normalizers: PropTypes.func
}
