export default function useIntlContext(): import("../core/IntlConfig").default<import("../core/AbstractIntlMessages").default> & {
    onError: (error: import("..").IntlError) => void;
    getMessageFallback: (info: {
        error: import("..").IntlError;
        key: string;
        namespace?: string | undefined;
    }) => string;
} & {
    messageFormatCache?: import("../core/MessageFormatCache").default | undefined;
};
