import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import DocumentTitle from 'react-document-title';
import Form from '../components/form';

class NewUser extends Component {
  componentWillMount() {
    const { loadForm, directory } = this.props;
    if (!directory.form.length) loadForm();
  }

  addNewUser(obj) {
    const { addUser, setError } = this.props;
    addUser(obj, (err) => {
      if (err) return setError(err);
      console.log('Added user', err);
    });
  }

  render() {
    const { directory, setError } = this.props;
    const { validators, normalizers, actor, people, form } = directory;

    return (
      <DocumentTitle title={'New | Team listing'}>
        <div>
          <div className='fill-light pad2y pad2x round-top quiet dark'>
            <h3 className='icon account'>{`Create new member`}</h3>
          </div>
          {directory.form.length ? <div>
            <Form
              actor={actor}
              people={people}
              setError={setError}
              normalizers={normalizers}
              validators={validators}
              onSubmit={this.addNewUser.bind(this)}
              data={form} />
          </div> : <div>
            <div className='center'>
              <h2>No form directory found.</h2>
              <p>Check your configuration settings.</p>
            </div>
          </div>}
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);
