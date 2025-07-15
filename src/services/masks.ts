import { EmailMask, PhoneMask } from './types';

export const phoneMask: PhoneMask = {
    placeholder: '+7 (___) ___-__-__',
    format: '+7 (###) ###-##-##'
};

export const emailMask: EmailMask = {
    rules: [
        {
            required: true,
            message: 'Пожалуйста, введите email',
        },
        {
            type: 'email',
            message: 'Введите корректный email',
        },
    ],
    props: {
        placeholder: 'example@domain.com',
    },
};
