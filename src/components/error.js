import React, { Component, PropTypes } from 'react';

export default class ErrorDialog extends Component {
  render() {
    const { error, dismissError } = this.props;
    const active = (error) ? 'active' : '';
    if (active) window.setTimeout(dismissError, 3000);
    return (
      <div>
        <div className={`fixed-bottomleft z10 col3 offcanvas-bottom animate pad1 ${active}`}>
          <div className='error-console fill-orange round pad1 small quiet'>
            <strong className='icon alert'>{error}</strong>
          </div>
        </div>
      </div>
    );
  }
}

ErrorDialog.propTypes = {
  error: PropTypes.string.isRequired,
  dismissError: PropTypes.func.isRequired
};
