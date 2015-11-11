import React from 'react';
import md5 from 'md5-jkmyers';
import VCard from 'vcf';
import { Base64 } from 'js-base64';

const initialState = {
  options: {
    org: '',
    repo: '',
    people: '',
    form: ''
  },
  actor: {},
  form: [],
  links: [],
  people: [],
  message: '',
  error: ''
};

function vCard(d) {
  const nameIsAscii = (d.lname + d.fname).match(/[^ -~]/) === null;
  const card = (new VCard())
    .set('N', d.lname + ';' + d.fname, nameIsAscii ? {} : {charset: 'UTF-8'})
    .set('EMAIL', d.email)
    .set('ORG', 'Mapbox')
    .set('TEL', d.cell)
    .toString();

  return 'data:text/vcard;base64,' + Base64.encode(card);
}

const links = [{
  "key": "cell",
  "icon": "mobile",
  "label": "Cell",
  "url": "tel:"
}, {
  "key": "email",
  "icon": "mail",
  "label": "Email",
  "url": "mailto:"
}, {
  "key": "github",
  "icon": "github",
  "label": "GitHub",
  "url": "https://github.com/"
}, {
  "key": "twitter",
  "icon": "twitter",
  "label": "Twitter",
  "url": "https://twitter.com/"
}];

initialState.validators = function(d, c) { return c(null); };
initialState.normalizers = function(d, c) { return c(d); };

initialState.listingTemplate = function(d) {
  return (
    <div>
      <div className='col12 clearfix space-bottom0'>
        <img
          src={`https://www.gravatar.com/avatar/${md5(d.email.toLowerCase())}`}
          className='square4 dot inline fl' />
        <div className='info inline pad1x'>
          <strong className='inline pad1y'>{`${d.fname} ${d.lname}`}</strong>
        </div>
        <div className='space pin-topright quiet pad1y'>
        </div>
      </div>
      <div className='col12 clearfix'>
        <div className='col12 quiet clearfix space-bottom1'>
          <div className='col6'>
            <div className='space'>
              <strong>Birthday</strong>{d.birthday}
            </div>
            <div className='space'>
              <strong>Contact info</strong>
                <a href={vCard(d)}>Download vCard</a>
            </div>
          </div>
          <div className='col6 mobile-cols clearfix'>
            {links.map((l, i) => {
              return (d[l.key]) ? (
                <div key={i} className='link col6'>
                  <a
                    target='_blank'
                    href={`${l.url}${d[l.key]}`}
                    className={`block col12 truncate strong icon ${l.icon}`}>
                    {`${d[l.key]}`}
                  </a>
                </div>
              ) : '';
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default initialState;
