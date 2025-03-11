'use strict';

/**
 * pqstore service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pqstore.pqstore');
