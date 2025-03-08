'use strict';

/**
 * pqpayment service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pqpayment.pqpayment');
