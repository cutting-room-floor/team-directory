import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import ErrorDialog from '../components/error';

class App extends Component {
  componentWillMount() {
    this.props.loadPeople();
  }

  render() {
    const { children, directory, dismissModal, dismissError } = this.props;
    const { message, error, people } = directory;

    return (
      <div className='contain min-containment'>
        <nav className='col12 fill-navy dark z10'>
          <div className='limiter'>
            <nav className='primary'>
              <Link
                className='strong animate pad2y pad0x'
                to={`/`}>
                Team listing
              </Link>
              <Link
                className='strong animate pad2y pad0x'
                to={'/new'}>
                New member
              </Link>
            </nav>
          </div>
        </nav>
        {people && <div className='limiter pad4y'>
          {children}
        </div>}
        {error && <ErrorDialog
          dismissError={dismissError}
          error={error}>
          </ErrorDialog>}
        {message && <Modal
          onModalClose={dismissModal}>
          This is a modal
        </Modal>}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  dismissModal: PropTypes.func,
  loadPeople: PropTypes.func.isRequired,
  message: PropTypes.string
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
