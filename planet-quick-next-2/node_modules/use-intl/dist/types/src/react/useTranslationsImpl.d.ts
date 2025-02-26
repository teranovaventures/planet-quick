/// <reference types="react" />
import AbstractIntlMessages from '../core/AbstractIntlMessages';
import NestedKeyOf from '../core/utils/NestedKeyOf';
export default function useTranslationsImpl<Messages extends AbstractIntlMessages, NestedKey extends NestedKeyOf<Messages>>(allMessages: Messages, namespace: NestedKey, namespacePrefix: string): {
    <TargetKey extends unknown>(key: TargetKey, values?: import("../core/TranslationValues").default | undefined, formats?: Partial<import("../core/Formats").default> | undefined): string;
    rich: (key: string, values?: import("../core").RichTranslationValues | undefined, formats?: Partial<import("../core/Formats").default> | undefined) => string | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactNodeArray;
    markup(key: string, values: import("../core").MarkupTranslationValues, formats?: Partial<import("../core/Formats").default> | undefined): string;
    raw(key: string): any;
};
