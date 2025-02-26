import type IntlMessageFormat from 'intl-messageformat';
type MessageFormatCache = Map<
/** Format: `${locale}.${namespace}.${key}.${message}` */
string, IntlMessageFormat>;
export default MessageFormatCache;
