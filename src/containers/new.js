import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import DocumentTitle from 'react-document-title';
import Form from '../components/form';

class NewUser extends Component {
  componentWillMount() {
    const { loadForm, data } = this.props;
    if (!data.form.length) loadForm();
  }

  render() {
    const { data, setError } = this.props;
    const { validators, normalizers } = this.props.data.options;

    return (
      <DocumentTitle title={'New | Team listing'}>
        {data.form.length ? <div>
          <Form
            people={data.people}
            setError={setError}
            normalizers={normalizers}
            validators={validators}
            data={data.form} />
        </div> : <div>
          <div className='center'>
            <h2>No form data found.</h2>
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
