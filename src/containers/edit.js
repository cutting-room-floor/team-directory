import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { updatePath } from 'redux-simple-router';

import DocumentTitle from 'react-document-title';
import Form from '../components/form';

class EditUser extends Component {
  componentWillMount() {
    const { directory, loadUser, reRoute, routeParams } = this.props;
    const { actor, options } = directory;
    const username = routeParams.user;

    if (!actor.admin) {
      if (username.toLowerCase() !== actor.login.toLowerCase()) reRoute(options.basePath + '404');
    }

    loadUser(username);
  }

  removeUser() {
    const { directory, removeUser, routeParams, setMessage, setError, reRoute } = this.props;
    const user = routeParams.user;
    const prompt = window.prompt('Are you sure? Enter their GitHub username to continue');

    if (prompt === user) {
      removeUser(user, (err) => {
        if (err) return setError(err);
        setMessage({
          title: `${user} removed.`,
          content: 'Record has been saved.',
          action: 'Okay',
          onClickHandler: () => {
            setMessage('');
            reRoute(directory.options.basePath);
          }
        });
      });
    } else {
      setError('GitHub account name was not entered correctly.');
    }
  }

  editUser(obj) {
    const { directory, updateUser, setMessage, setError, reRoute } = this.props;
    updateUser(obj, (err) => {
      if (err) return setError(err);
      setMessage({
        title: `${obj.github} updated!`,
        content: 'Record has been saved.',
        action: 'Okay',
        onClickHandler: () => {
          setMessage('');
          reRoute(directory.options.basePath);
        }
      });
    });
  }

  render() {
    const { directory, setError, routeParams } = this.props;
    const { validators, normalizers, team, actor, user, form } = directory;
    const parts = (form.length && user);

    return (
      <DocumentTitle title={`Edit ${routeParams.user} | Team listing`}>
        <div>
          <div className='fill-light pad2y pad2x round-top quiet dark'>
            <h3 className='icon account'>{`Edit ${routeParams.user}`}</h3>
          </div>
        {parts ? <div>
          <Form
            team={team}
            actor={actor}
            user={user}
            setError={setError}
            normalizers={normalizers}
            validators={validators}
            onDelete={this.removeUser.bind(this)}
            onSubmit={this.editUser.bind(this)}
            data={form} />
        </div> : <div>
          <div className='center pad2y'>
            <h2>No form document found.</h2>
            <p>Check your configuration settings.</p>
          </div>
        </div>}
        </div>
      </DocumentTitle>
    );
  }
}

EditUser.propTypes = {
  directory: PropTypes.object.isRequired,
  reRoute: PropTypes.func.isRequired,
  routeParams: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, { reRoute: updatePath }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
