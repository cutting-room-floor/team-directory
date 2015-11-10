import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

class EditUser extends Component {
  componentWillMount() {
    // TODO Handle redirection here
    // if a user is not eligible to edit this document.
  }

  render() {
    return (
      <div>
        Edit page
      </div>
    );
  }
}

EditUser.propTypes = {
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
