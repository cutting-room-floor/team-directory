import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';

export default class Select extends Component {

  constructor(props) {
    super();

    this.state = {
      inputValue: '',
      suggestions: props.options
    }

    this.change = this.change.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.remove = this.remove.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  getSuggestions(v) {
    const { options, value } = this.props;
    v = v.trim().toLowerCase();
    const inputLength = v.length;
    return inputLength === 0 ? [] : options.filter(d =>
      d.label.toLowerCase().slice(0, inputLength) === v
    ).filter(d => {
      if (!value) return d;
      const contains = value.some(v => {
        return v.key === d.key
      });
      return !contains; 
    });
  }

  onSuggestionsUpdateRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  }

  onInputChange(_, { newValue }) {
    this.setState({
      inputValue: newValue
    });
  }

  remove(e) {
    e.preventDefault();
    const { onChange, id, value } = this.props;
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    let group = value ? value : [];
    group = group.filter((_, i) => i !== index);
    onChange(id, group);
  }

  change(e, v) {
    e.preventDefault();
    const { onChange, id, value } = this.props;
    let group = value ? value : [];
    group.push(v.suggestion);
    onChange(id, group);

    // Clear input value
    this.setState({inputValue: ''});
  }

  render() {
    const { id, value, placeholder } = this.props;
    const { inputValue, suggestions } = this.state;
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
          <div className='row1 fill-darken0 pad1 round-left'>
            {field.label}
          </div>
        </div>
      );
    }.bind(this);

    const getSuggestionValue = function(d) {
      return d.label;
    };

    const renderSuggestion = function(d) {
      return (
        <span>{d.label}</span>
      )
    };

    return (
      <fieldset>
        {value && value.map(addToList)}
        <Autosuggest
          suggestions={suggestions}
          getSuggestionValue={getSuggestionValue}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          onSuggestionSelected={this.change}
          renderSuggestion={renderSuggestion}
          inputProps={{
            value: inputValue,
            placeholder: placeholder,
            className: 'col12',
            name: id,
            onChange: this.onInputChange
          }}
        />
      </fieldset>
    );
  }
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string
}
