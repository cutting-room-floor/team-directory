import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as actions from '../actions';
import { csvBuffered } from 'json-csv';
import VCard from 'vcf';
import { saveAs } from 'filesaver.js';
import { Base64 } from 'js-base64';
import { updatePath } from 'redux-simple-router';
import Filter from '../components/filter';
import DocumentTitle from 'react-document-title';
import Modal from 'react-modal';
import modalStyle from '../modal_style'

class Index extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { showStats: false };
  }

  showModal(e) {
    e.preventDefault();
    this.setState({ showStats: true });
  }

  dismissModal() {
    this.setState({ showStats: false });
  }

  downloadCSV(e) {
    e.preventDefault();
    const { team, form } = this.props.directory;
    let fields = [];

    // Build a header from the key values in form
    form.forEach((section) => {
      section.data.forEach((item) => {
        fields.push({
          name: item.key,
          label: item.label,
          filter: function(d) {
            if (typeof d === 'object' && d.length) {
              if (typeof d[0] === 'object') {
                var value = [];
                d.forEach(function(d) {
                  if (d.name && d.value) {
                    value.push(d.name + ': ' + d.value);
                  } else {
                    value.push(d.label);
                  }
                })
                return value.join(', ');
              } else {
                return d.join(', ');
              }
            }
            return d;
          }
        });
      });
    });

    csvBuffered(team, {
      fields: fields
    }, function(err, csv) {
      if (err) return console.warn(err);
      saveAs(new Blob([csv], {
        type: 'text/csv;base64'
      }), 'team.csv');
    });
  }

  downloadContacts() {
    const { directory } = this.props;
    const card = [];
    directory.team.forEach((d) => {
      const nameIsAscii = (d.lname + d.fname).match(/[^ -~]/) === null;
      card.push((new VCard())
        .set('n', d.lname + ';' + d.fname, nameIsAscii ? {} : {charset: 'UTF-8'})
        .set('email', d.email)
        .set('org', directory.options.account)
        .set('tel', d.cell)
        .toString());
    });
    return 'data:text/vcard;charset=utf-8;base64,' + Base64.encode(card.join('\n'));
  }

  render() {
    const { directory, teamFilter, teamSort, reRoute, location} = this.props;
    const { team, filterList, sortKeys, actor, options, listingTemplate, statsTemplate } = directory;
    const bp = directory.options.basePath;

    return (
      <DocumentTitle title={'Team listing'}>
        {team.length ? <div>

          {statsTemplate && <Modal
            isOpen={this.state.showStats}
            style={modalStyle}
            onRequestClose={this.dismissModal.bind(this)}>
            {statsTemplate(team)}
          </Modal>}

          {(team.length > 1) && <div>
            <div className='col12 clearfix space-bottom2'>
              <div className='text-right col12'>
                <div className='pill'>
                  {statsTemplate && <a href='#' onClick={this.showModal.bind(this)} className='short icon graph button pad4x'>Team stats</a>}
                  {actor.admin && <a href='#' onClick={this.downloadCSV.bind(this)} className='short icon down button loud button-secondary pad4x'>Download as CSV</a>}
                  <a href={this.downloadContacts()} className='short button button-secondary loud icon down pad4x'>Download all contacts</a>
                </div>
              </div>
            </div>
            <Filter
              directory={directory}
              sortKeys={sortKeys}
              updatePath={reRoute}
              filter={teamFilter}
              query={location.query}
              sort={teamSort} />
          </div>}
          {filterList.map((d, index) => {
            const access = (actor.admin || d.github.toLowerCase() === actor.login.toLowerCase()) ? true : false;
            return (
              <div key={index} className='clip small contain mobile-cols pad0y col12 clearfix keyline-bottom no-last-keyline'>
                {access && <div className='space pin-topright quiet pad1y z1'>
                  <Link className='quiet'
                    to={`${bp}edit/${d.github}`}>
                  Edit
                  </Link>
                </div>}
                {listingTemplate(d)}
              </div>
            );
          })}

        </div> : <div className='center'>
          <h2>No users.</h2>
          <div className='pad2y'>
            <Link className='button pad4x' to={`${bp}new`}>Create one?</Link>
          </div>
        </div>}
      </DocumentTitle>
    );
  }
}

Index.propTypes = {
  directory: PropTypes.object.isRequired,
  teamFilter: PropTypes.func.isRequired,
  teamSort: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  reRoute: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, { reRoute: updatePath }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
