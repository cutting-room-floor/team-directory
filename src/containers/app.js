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

    const modalStyle = {
      overlay: {
        backgroundColor:'rgba(0,0,0,0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      content: {
        background: '#fff',
        position: 'absolute',
        top: '0',
        right: '0',
        left: '0',
        padding: '0px',
        bottom: 'auto',
        width: '400px',
        border: 'none',
        overflow: 'hidden',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '3px',
        outline: 'none',
        marginTop: '40px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    };

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
