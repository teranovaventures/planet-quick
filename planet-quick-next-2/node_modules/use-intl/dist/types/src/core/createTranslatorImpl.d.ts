/// <reference types="react" />
import AbstractIntlMessages from './AbstractIntlMessages';
import { InitializedIntlConfig } from './IntlConfig';
import MessageFormatCache from './MessageFormatCache';
import NestedKeyOf from './utils/NestedKeyOf';
export type CreateTranslatorImplProps<Messages> = Omit<InitializedIntlConfig, 'messages'> & {
    namespace: string;
    messages: Messages;
    messageFormatCache?: MessageFormatCache;
};
export default function createTranslatorImpl<Messages extends AbstractIntlMessages, NestedKey extends NestedKeyOf<Messages>>({ getMessageFallback, messages, namespace, onError, ...rest }: CreateTranslatorImplProps<Messages>, namespacePrefix: string): {
    <TargetKey extends import("./utils/MessageKeys").default<import("./utils/NestedValueOf").default<Messages, NestedKey>, NestedKeyOf<import("./utils/NestedValueOf").default<Messages, NestedKey>>>>(key: TargetKey, values?: import("./TranslationValues").default | undefined, formats?: Partial<import("./Formats").default> | undefined): string;
    rich: (key: string, values?: import("./TranslationValues").RichTranslationValues | undefined, formats?: Partial<import("./Formats").default> | undefined) => string | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactNodeArray;
    markup(key: string, values: import("./TranslationValues").MarkupTranslationValues, formats?: Partial<import("./Formats").default> | undefined): string;
    raw(key: string): any;
};
