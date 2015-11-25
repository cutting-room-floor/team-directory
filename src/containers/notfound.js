import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as actions from '../actions';
import DocumentTitle from 'react-document-title';

export default class NotFound extends Component {
  render() {
    var { directory } = this.props
    return (
      <DocumentTitle title='Not found | Us'>
      <div className='center'>
        <h2 className='block space-bottom2'>Page not found</h2>
        <Link
          className='button pad4x'
          to={directory.options.basePath}>
          Back home?
        </Link>
      </div>
      </DocumentTitle>
    );
  }
}

NotFound.propTypes = {
  directory: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
