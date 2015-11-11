import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

class EditUser extends Component {
  componentWillMount() {
    // TODO Handle redirection here
    // if a user is not eligible to edit this document.
  }

  // User removal TODO pass this to Form
  onDelete() {
    const { setError } = this.props;
    const user = this.getParams().user;
    const prompt = window.prompt('Are you sure? Enter their GitHub username to continue');

    if (prompt === user) {
      actions.destroyUser(this.getParams().user);
    } else {
      actions.setError('GitHub account name was not entered correctly.');
    }
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
