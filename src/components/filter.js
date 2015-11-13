import React, { Component, PropTypes } from 'react';

export default class Filter extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentWillUnmount() {
    // this.props.filter(null);
  }

  sort(e) {
    const value = e.target.getAttribute('id');
    // var query = this.getQuery();
    // query.sort = value;
    // this.replaceWith(this.getPathname(), {}, query);
    this.props.sort(value);
  }

  filter(e) {
    const { filter } = this.props;
    const value = encodeURIComponent(e.target.value);

    // const query = this.getQuery();
    // query.filter = value;
    // this.replaceWith(this.getPathname(), {}, query);

    // console.log('value', e.target.value);
    filter(value);
  }

  render() {
    /*
    // TODO use the filter variable to populate "value" in input
    const query = this.getQuery();
    const sort = (query.sort) ? query.sort : 'name';
    const filter = (query.filter) ? decodeURIComponent(query.filter) : '';
    */

    const sort = 'name';
    const filter = '';

    return (
      <div className='with-icon space-bottom1'>
        <span className='icon search'></span>
        <input onChange={this.filter.bind(this)} className='col12' placeholder='filter' type='text' />
        <div className='pin-right pad0x'>
          <form onChange={this.sort.bind(this)} className='rounded-toggle'>
            <input id='name' type='radio' name='sort-toggle' value='name' defaultChecked={sort === 'name'} />
            <label htmlFor='name' className='animate'>name</label>
            <input id='date' type='radio' name='sort-toggle' value='date' defaultChecked={sort === 'date'} />
            <label htmlFor='date' className='animate'>date</label>
          </form>
        </div>
      </div>
    );
  }
}

Filter.propTypes = {
  sortKeys: PropTypes.array.isRequired,
  updatePath: PropTypes.func.isRequired,
  filter: PropTypes.func.isRequired,
  sort: PropTypes.func
};
