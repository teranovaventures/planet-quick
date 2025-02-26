import { ReactElement, ReactNodeArray } from 'react';
import AbstractIntlMessages from './AbstractIntlMessages';
import Formats from './Formats';
import { InitializedIntlConfig } from './IntlConfig';
import IntlError from './IntlError';
import MessageFormatCache from './MessageFormatCache';
import TranslationValues, { MarkupTranslationValues, RichTranslationValues } from './TranslationValues';
import MessageKeys from './utils/MessageKeys';
import NestedKeyOf from './utils/NestedKeyOf';
import NestedValueOf from './utils/NestedValueOf';
export type CreateBaseTranslatorProps<Messages> = InitializedIntlConfig & {
    messageFormatCache?: MessageFormatCache;
    defaultTranslationValues?: RichTranslationValues;
    namespace?: string;
    messagesOrError: Messages | IntlError;
};
export default function createBaseTranslator<Messages extends AbstractIntlMessages, NestedKey extends NestedKeyOf<Messages>>(config: Omit<CreateBaseTranslatorProps<Messages>, 'messagesOrError'>): {
    <TargetKey extends MessageKeys<NestedValueOf<Messages, NestedKey>, NestedKeyOf<NestedValueOf<Messages, NestedKey>>>>(key: TargetKey, values?: TranslationValues | undefined, formats?: Partial<Formats> | undefined): string;
    rich: (key: string, values?: RichTranslationValues | undefined, formats?: Partial<Formats> | undefined) => string | ReactElement<any, string | import("react").JSXElementConstructor<any>> | ReactNodeArray;
    markup(key: string, values: MarkupTranslationValues, formats?: Partial<Formats> | undefined): string;
    raw(key: string): any;
};
