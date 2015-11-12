import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as actions from '../actions';
import VCard from 'vcf';
import { saveAs } from 'filesaver.js';
import { Base64 } from 'js-base64';
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
    const { people, form } = this.props.directory;
    let header = [];

    // Build a header from the key values in form
    form.forEach((section) => {
      section.data.forEach((item) => {
        header.push(item.key);
      });
    });

    let csv = header.join(', ') + '\n';

    people.forEach((d) => {
      let user = [];
      header.forEach((h) => {
        let val = '';
        if (d[h]) {
          if (typeof d[h] === 'object') {
            if (typeof d[h][0] === 'object') {
              val = '';
              d[h].forEach((v) => {
                for (let key in v) {
                  val += JSON.stringify(v[key]) + ' ';
                }
              });
            } else {
              val = '"' + d[h].join(', ') + '"';
            }
          } else {
            val = '"' + d[h] + '"';
          }
        }

        user.push(val);
      });

      csv += user.join(', ') + '\n';
    });

    saveAs(new Blob([csv], {
      type: 'text/csv;base64'
    }), 'people.csv');
  }

  downloadContacts() {
    const { directory } = this.props;
    const card = [];
    directory.people.forEach((d) => {
      card.push((new VCard())
        .set('N', d.lname + ';' + d.fname)
        .set('EMAIL', d.email)
        .set('ORG', directory.options.org)
        .set('TEL', d.cell)
        .toString());
    });
    return 'data:text/vcard;base64,' + Base64.encode(card.join('\n'));
  }

  render() {
    const { directory, peopleFilter, peopleSort } = this.props;
    const { people, actor, listingTemplate, statsTemplate } = directory;

    return (
      <DocumentTitle title={'Team listing'}>
        {people.length ? <div>

          {statsTemplate && <Modal
            isOpen={this.state.showStats}
            style={modalStyle}
            onRequestClose={this.dismissModal.bind(this)}>
            {statsTemplate(people)}
          </Modal>}

          {(people.length > 1) && <div>
            <div className='col12 clearfix space-bottom2'>
              <div className='text-right col12'>
                <div className='pill'>
                  {statsTemplate && <a href='#' onClick={this.showModal.bind(this)} className='short icon graph button pad4x'>Team stats</a>}
                  {actor.admin && <a href='#' onClick={this.downloadCSV.bind(this)} className='short icon down button loud pad4x'>Download as CSV</a>}
                  <a href={this.downloadContacts()} className='short button loud icon down pad4x'>Download contacts</a>
                </div>
              </div>
            </div>
            <Filter
              sortKeys={[]}
              filterKeys={[]}
              filter={peopleFilter}
              sort={peopleSort} />
          </div>}
          {people.map((d, index) => {
            const access = (actor.admin || d.github.toLowerCase() === actor.login.toLowerCase()) ? true : false;
            return (
              <div key={index} className='clip small contain mobile-cols pad0y col12 clearfix keyline-bottom no-last-keyline'>
                {access && <div className='space pin-topright quiet pad1y'>
                  <a
                    className='quiet'
                    href={`edit/${d.github}`}>
                    Edit
                  </a>
                </div>}
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
