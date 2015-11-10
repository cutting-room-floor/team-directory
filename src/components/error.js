import React, { Component, PropTypes } from 'react';

export default class ErrorDialog extends Component {
  componentWillMount() {
    const { dismissError } = this.props;
    window.setTimeout(() => {
      dismissError();
    }, 3000);
  }

  render() {
    const { error, dismissError } = this.props;
    return (
      <div>
        <div className={`fixed-bottomleft z10 col3 offcanvas-bottom animate pad2 active`}>
          <div className='fill-orange round pad1 small quiet'>
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
