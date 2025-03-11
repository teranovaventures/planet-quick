'use strict';

/**
 * pqstore router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::pqstore.pqstore');
