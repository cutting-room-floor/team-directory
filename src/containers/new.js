import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';
import * as actions from '../actions';
import DocumentTitle from 'react-document-title';
import Form from '../components/form';

class NewUser extends Component {
  addNewUser(obj) {
    const { directory, addUser, setMessage, setError, reRoute } = this.props;
    addUser(obj, (err) => {
      if (err) return setError(err);
      setMessage({
        title: `${obj.github} created!`,
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
    const { directory, setError } = this.props;
    const { validators, normalizers, actor, team, form } = directory;

    return (
      <DocumentTitle title={'New | Team listing'}>
        <div>
          <div className='fill-light pad2y pad2x round-top quiet dark'>
            <h3 className='icon account'>{`Create new member`}</h3>
          </div>
          {directory.form.length ? <div>
            <Form
              actor={actor}
              team={team}
              setError={setError}
              normalizers={normalizers}
              validators={validators}
              onSubmit={this.addNewUser.bind(this)}
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

NewUser.propTypes = {
  directory: PropTypes.object.isRequired,
  addUser: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  reRoute: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, { reRoute: updatePath }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);
