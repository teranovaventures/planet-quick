'use strict';

var React = require('react');
var IntlContext = require('./IntlContext-b5cc6be8.js');

function useIntlContext() {
  const context = React.useContext(IntlContext.IntlContext);
  if (!context) {
    throw new Error('No intl context found. Have you configured the provider?' );
  }
  return context;
}

function useLocale() {
  return useIntlContext().locale;
}

exports.useIntlContext = useIntlContext;
exports.useLocale = useLocale;
