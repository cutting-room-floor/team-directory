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

  render() {
    const { directory, setError } = this.props;
    const { validators, normalizers, people, form } = directory;

    return (
      <DocumentTitle title={'New | Team listing'}>
        {directory.form.length ? <div>
          <Form
            people={people}
            setError={setError}
            normalizers={normalizers}
            validators={validators}
            data={form} />
        </div> : <div>
          <div className='center'>
            <h2>No form directory found.</h2>
            <p>Check your configuration settings.</p>
          </div>
        </div>}
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
