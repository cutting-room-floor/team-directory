import React from 'react';
import md5 from 'md5-jkmyers';
import VCard from 'vcf';
import { Base64 } from 'js-base64';

const initialState = {
  message: '',
  error: '',
  options: {
    org: '',
    repo: '',
    team: '',
    form: '',
    filterKeys: ['github']
  },
  form: [],
  links: [],
  actor: null,
  user: null,
  team: null,
  filterList: null
};

function vCard(d) {
  const nameIsAscii = (d.lname + d.fname).match(/[^ -~]/) === null;
  const card = (new VCard())
    .set('N', d.lname + ';' + d.fname, nameIsAscii ? {} : {charset: 'UTF-8'})
    .set('EMAIL', d.email)
    .set('TEL', d.cell)
    .toString();

  return 'data:text/vcard;base64,' + Base64.encode(card);
}

const links = [{
  key: 'cell',
  icon: 'mobile',
  label: 'Cell',
  url: 'tel:'
}, {
  key: 'email',
  icon: 'mail',
  label: 'Email',
  url: 'mailto:'
}, {
  key: 'github',
  icon: 'github',
  label: 'GitHub',
  url: 'https://github.com/'
}, {
  key: 'twitter',
  icon: 'twitter',
  label: 'Twitter',
  url: 'https://twitter.com/'
}];

initialState.validators = function(d, c) { return c(null); }; // no-op
initialState.normalizers = function(d, c) { return c(d); }; // no-op

initialState.sorts = [{
    key: 'name',
    sort: function(team) {
      return team.sort((a, b) => {
        a = new Date(a.birthday).getTime();
        b = new Date(b.birthday).getTime();
        return b - a;
      });
    }
  }, {
    key: 'date',
    sort: function(team) {
      return team.sort((a, b) => {
        a = (a.lname) ? a.lname.split(' ') : '';
        b = (b.lname) ? b.lname.split(' ') : '';
        a = a[1] ? a[1] : a[0];
        b = b[1] ? b[1] : b[0];
        return a.localeCompare(b);
      });
    }
}];

initialState.sortKeys = initialState.sorts.reduce((memo, sort) => {
  memo.push(sort.key);
  return memo;
}, []);

initialState.statsTemplate = function(team) {
  const f = team.filter((_) => {
    return _.sex === 'xx';
  }).length;

  const stats = [
    { name: 'Total team', value: team.length },
    { name: 'Women', value: (f / team.length * 100).toFixed(1) + '%' },
    { name: 'Men', value: ((team.length - f) / team.length * 100).toFixed(1) + '%' }
  ];

  return (
    <div className='fill-white pad4'>
      <div className='col12 space-bottom1'>
        <h2>Team stats</h2>
      </div>
      <div className='keyline-all round listing'>
        {stats.map((stat, i) => {
          return (
            <div key={i} className='pad1 col12 clearfix mobile-cols keyline-bottom'>
              <strong className='col6'>{stat.name}</strong>
              <span className='col6 text-right'>{stat.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
