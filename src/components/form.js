import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

// Form components
import Textarea from './form_types/textarea';
import Native from './form_types/native';
import Radio from './form_types/radio';
import Checkbox from './form_types/checkbox';
import Add from './form_types/add';
import AddSingle from './form_types/add_single';
import Select from './form_types/select';

export default class Form extends Component {
  constructor(props, context) {
    super(props, context);
    const { user, data } = this.props;
    this.state = this.mapUser(user, data);
  }

  componentWillReceiveProps(next) {
    const { user, data } = next;
    if (!this.submission) this.setState(this.mapUser(user, data));
  }

  mapUser(user, data) {
    // Map any existing user data to form properties.
    return data.reduce((memo, section) => {
      section.data.forEach((field) => {
        memo[field.key] = '';
        if (user) {
          if (user[field.key] || typeof user[field.key] === 'boolean') {
            memo[field.key] = user[field.key];
          }
        }
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
    this.submission = true;

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
      Object.keys(data).forEach(key => {
        // If the key we are looking falls under required
        if (key === d.key) {
          const value = data[key];
          if (typeof value === 'string' && value ||
              typeof value === 'boolean' ||
              typeof value === 'object' && value.length) contains = true;
        }
      });

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
        if (!data[key]) {
          if (typeof data[key] !== 'boolean') delete data[key];
        }

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

  setFormValue(k, v) {
    var obj = {};
    obj[k] = v;
    this.setState(obj);
  }

  render() {
    const { data, actor, user, onDelete } = this.props;
    const addFields = function(d, i) {
      const placeholder = (d.placeholder) ? d.placeholder : d.label ? d.label : '';
      const type = (d.type) ? d.type : 'text';
      const hidden = (type === 'hidden') ? 'hidden' : false;
      const defaultRenderer = (type === 'text' ||
                               type === 'date' ||
                               type === 'hidden' ||
                               type === 'number');

      if (d.admin && !actor.admin) return;

      return (
        <fieldset id={d.key} key={i} className={`col6 pad1x ${hidden}`}>
          <label>{d.label}
            {d.required && <span className='question' title='Field is required'>*</span>}
            {d.admin && <span
              className='inline fill-yellow quiet space-left0 strong pad0x round keyline-all'
              title='Admin only field'>admin</span>
            }
          </label>
          {type === 'textarea' && <Textarea
            id={d.key}
            placeholder={placeholder}
            onChange={this.setFormValue.bind(this)}
            value={this.state[d.key]}
            required={d.required}
          />}
          {type === 'radio' && <Radio
            id={d.key}
            onChange={this.setFormValue.bind(this)}
            value={this.state[d.key]}
            fields={d.fields}
          />}
          {type === 'checkbox' && <Checkbox
            id={d.key}
            onChange={this.setFormValue.bind(this)}
            value={this.state[d.key]}
            fields={d.fields}
          />}
          {type === 'add' && <Add
            id={d.key}
            onChange={this.setFormValue.bind(this)}
            value={this.state[d.key]}
          />}
          {type === 'add-single' && <AddSingle
            id={d.key}
            onChange={this.setFormValue.bind(this)}
            value={this.state[d.key]}
            placeholder={placeholder}
          />}
          {type === 'select' && <Select
            id={d.key}
            onChange={this.setFormValue.bind(this)}
            value={this.state[d.key]}
            options={d.options}
            placeholder={placeholder}
          />}
          {defaultRenderer && <Native
            id={d.key}
            type={type}
            placeholder={placeholder}
            onChange={this.setFormValue.bind(this)}
            value={this.state[d.key]}
            required={d.required}
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
