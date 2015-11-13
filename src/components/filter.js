import React, { Component, PropTypes } from 'react';
import { Route } from 'react-router';

export default class Filter extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { query, filter } = this.props;
    if (query.filter) filter(query.filter);
  }

  componentWillUnmount() {
    const { query, filter } = this.props;
    if (query.filter) filter(null);
  }

  sort(e) {
    const value = e.target.getAttribute('id');
    // var query = this.getQuery();
    // query.sort = value;
    // this.replaceWith(this.getPathname(), {}, query);
    this.props.sort(value);
  }

  filter(e) {
    const { filter, updatePath, query } = this.props;
    const value = encodeURIComponent(e.target.value.trim());
    updatePath(query.sort ? `/?filter=${value}&sort=${query.sort}` : `/?filter=${value}`);
    filter(value);
  }

  render() {
    const { query } = this.props;
    const filterValue = (query.filter) ? decodeURIComponent(query.filter) : '';

    /*
    // TODO use the filter variable to populate "value" in input
    const sort = (query.sort) ? query.sort : 'name';
    */

    const sort = 'name';

    return (
      <div className='with-icon space-bottom1'>
        <span className='icon search'></span>
        <input onChange={this.filter.bind(this)} className='col12' placeholder='filter' type='text' value={filterValue} />
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
  query: PropTypes.object.isRequired,
  filter: PropTypes.func.isRequired,
  sort: PropTypes.func
};
