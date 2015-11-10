import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as actions from '../actions';

import DocumentTitle from 'react-document-title';

import Listing from '../components/listing';

class Index extends Component {
  render() {
    const { people } = this.props.data;

    return (
      <DocumentTitle title={'Team listing'}>
        {people.length ? <div>
          <Listing data={[]} />
        </div> : <div className='center'> 
          <h2>No users.</h2>
          <div className='pad2y'>
            <Link className='button pad4x' to={'/new'}>Create one?</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Index);
