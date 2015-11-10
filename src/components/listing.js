import React, { Component, PropTypes } from 'react';

export default class Listing extends Component {
  render() {
    return (
      <div>
        <div className={`fixed-bottomleft z10 col3 offcanvas-bottom animate pad2 active`}>
          <div className='fill-orange round'>
            <div className='pad1 small quiet'>
              <strong className='icon alert'></strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Listing.propTypes = {
  data: PropTypes.array.isRequired,
};
