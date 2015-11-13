import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import Modal from 'react-modal';
import modalStyle from '../modal_style'
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import ErrorDialog from '../components/error';

class App extends Component {
  componentWillMount() {
    const { loadPeople, loadForm } = this.props;
    loadPeople();
    loadForm();
  }

  render() {
    const { children, directory, dismissModal, dismissError } = this.props;
    const { message, error, people, form } = directory;
    const fetched = people && form;
    const loading = fetched ? '' : 'loading';

    return (
      <div className={`contain min-containment ${loading}`}>
        <nav className='col12 fill-navy dark z10'>
          <div className='limiter'>
            <nav className='primary'>
              <IndexLink
                className='strong animate pad2y pad0x'
                activeClassName='active'
                to='/'>
                Team listing
              </IndexLink>
              <Link
                className='strong animate pad2y pad0x'
                activeClassName='active'
                to={'/new'}>
                New member
              </Link>
            </nav>
          </div>
        </nav>
        {fetched && <div className='limiter pad4y'>
          {children}
        </div>}
        {error && <ErrorDialog
          dismissError={dismissError}
          error={error}>
          </ErrorDialog>}
        <Modal
          isOpen={!!message}
          style={modalStyle}
          onRequestClose={dismissModal}>
          <div className='clearfix'>
            <div className='pad4x pad2y'>
              <h3>{message.title}</h3>
              <p className='space-top1 quiet'>{message.content}</p>
            </div>
            <div className='col12 clearfix fill-light pad4x pad2y center'>
              <button onClick={message.onClickHandler} className='button pad4x animate'>{message.action}</button>
            </div>
          </div>
        </Modal>
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
