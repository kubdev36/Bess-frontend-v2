import React from 'react';
import { IntlProvider } from 'react-intl'
import { messages } from './Content'
import { signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime';
export const langConfig = signal('en');

export const LanguageProvider = ({ children }) => {
    useSignals();
    return (
        <IntlProvider
            locale={langConfig.value}
            messages={messages[langConfig.value]}
            defaultLocale={langConfig.value}
        >
            {children}
        </IntlProvider>
    );
}