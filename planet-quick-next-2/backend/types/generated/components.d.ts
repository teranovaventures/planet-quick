import type { Schema, Attribute } from '@strapi/strapi';

export interface MembereventPqmembers extends Schema.Component {
  collectionName: 'components_memberevent_pqmembers';
  info: {
    displayName: 'pqmembers';
  };
  attributes: {
    pqfirstname: Attribute.String;
    pqlastname: Attribute.String;
    pqemail: Attribute.Email;
    pqphone: Attribute.String;
  };
}

export interface MembereventPqvolunteers extends Schema.Component {
  collectionName: 'components_memberevent_pqvolunteers';
  info: {
    displayName: 'pqvolunteers';
  };
  attributes: {
    pqdescription: Attribute.String;
    pqquantity: Attribute.Integer;
  };
}

export interface PqbusinessdetailsPqbusinessdetails extends Schema.Component {
  collectionName: 'components_pqbusinessdetails_pqbusinessdetails';
  info: {
    displayName: 'pqbusinessdetails';
  };
  attributes: {
    pqtin: Attribute.String;
    pqformationdocs: Attribute.Media;
    pqpaymentinfo: Attribute.JSON;
  };
}

export interface PqbusinessdetailsPqeventstats extends Schema.Component {
  collectionName: 'components_pqbusinessdetails_pqeventstats';
  info: {
    displayName: 'pqeventstats';
    description: '';
  };
  attributes: {};
}

export interface PqeventstatsPqeventstats extends Schema.Component {
  collectionName: 'components_pqeventstats_pqeventstats';
  info: {
    displayName: 'pqeventstats';
  };
  attributes: {
    pqtotalevents: Attribute.BigInteger;
    pqfundsraised: Attribute.Decimal;
    pqdonationscount: Attribute.Integer;
    pqdonationvalue: Attribute.Decimal;
    pqguestcount: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'memberevent.pqmembers': MembereventPqmembers;
      'memberevent.pqvolunteers': MembereventPqvolunteers;
      'pqbusinessdetails.pqbusinessdetails': PqbusinessdetailsPqbusinessdetails;
      'pqbusinessdetails.pqeventstats': PqbusinessdetailsPqeventstats;
      'pqeventstats.pqeventstats': PqeventstatsPqeventstats;
    }
  }
}
