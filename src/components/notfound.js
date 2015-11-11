import React, { Component } from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

export default class Repo extends Component {
  render() {
    return (
      <DocumentTitle title='Not found | Us'>
      <div className='center'>
        <h2 className='block space-bottom2'>Page not found</h2>
        <Link
          className='button pad4x'
          to='/'>
          Back home?
        </Link>
      </div>
      </DocumentTitle>
    );
  }
}
