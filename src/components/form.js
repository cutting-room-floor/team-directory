import React, { Component, PropTypes } from 'react';

export default class Form extends Component {
  render() {
    return (
      <div>
        Form goes here
      </div>
    );
  }
}

Form.propTypes = {
  data: PropTypes.array.isRequired,
};
