import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as actions from '../actions';

import DocumentTitle from 'react-document-title';

class Index extends Component {
  render() {
    const { people, listingTemplate } = this.props.directory;

    return (
      <DocumentTitle title={'Team listing'}>
        {people.length ? <div>
          {people.map((d, index) => {
            return (
              <div key={index} className='clip small contain mobile-cols pad0y col12 clearfix keyline-bottom no-last-keyline'>
                <div className='space pin-topright quiet pad1y'>
                  <a
                    className='quiet'
                    href={`edit/${d.github}`}>
                    Edit
                  </a>
                </div>
                {listingTemplate(d)}
              </div>
            );
          })}
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
