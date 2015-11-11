import React, { Component, PropTypes } from 'react';
import md5 from 'md5-jkmyers';
import VCard from 'vcf';
import { Base64 } from 'js-base64';

export default class Listing extends Component {
  gravatar(email) {
    return 'https://www.gravatar.com/avatar/' + md5(email.toLowerCase());
  }

  vCard(d) {
    const nameIsAscii = (d.lname + d.fname).match(/[^ -~]/) === null;
    const card = (new VCard())
      .set('N', d.lname + ';' + d.fname, nameIsAscii ? {} : {charset: 'UTF-8'})
      .set('EMAIL', d.email)
      .set('ORG', 'Mapbox')
      .set('TEL', util.normalizeTel(d.cell))
      .toString();

    return 'data:text/vcard;base64,' + Base64.encode(card);
  }

  render() {
    const { data } = this.props;

    return (
      <div>
        {data.map((user, i) => {
          return (
            <div key={i}>
              foo
            </div>
          );
        })}
      </div>
    );
  }
}

Listing.propTypes = {
  data: PropTypes.array.isRequired,
};
