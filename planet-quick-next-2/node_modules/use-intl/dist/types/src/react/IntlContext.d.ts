/// <reference types="react" />
import MessageFormatCache from '../core/MessageFormatCache';
declare const IntlContext: import("react").Context<(import("../core/IntlConfig").default<import("../core/AbstractIntlMessages").default> & {
    onError: (error: import("..").IntlError) => void;
    getMessageFallback: (info: {
        error: import("..").IntlError;
        key: string;
        namespace?: string | undefined;
    }) => string;
} & {
    messageFormatCache?: MessageFormatCache | undefined;
}) | undefined>;
export default IntlContext;
