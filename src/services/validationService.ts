import { Rule } from 'antd/es/form';

export const validateFullName: Rule[] = [
    { required: true, message: 'Пожалуйста, введите ФИО' },
    { max: 100, message: 'Максимальная длина - 100 символов' },
];

export const validateBirthDate: Rule[] = [
    { required: true, message: 'Пожалуйста, выберите дату рождения' }
];

export const getExperienceValidator = (age: number | null): Rule[] => [
    () => ({
        validator(_, value) {
            if (value && age && value > age)
                return Promise.reject('Стаж не может быть больше возраста');
            if (value < 1)
                return Promise.reject('Стаж должен быть не менее 1 года');
            if (value && value > 100)
                return Promise.reject('Максимальный стаж - 100 лет');

            return Promise.resolve();
        },
    })
];

export const validatePosition: Rule[] = [
    { required: true, message: 'Пожалуйста, выберите должность' }
];

export const validateLogin: Rule[] = [
    { required: true, message: 'Пожалуйста, введите логин' },
    { min: 3, message: 'Минимальная длина - 3 символа' },
    { max: 20, message: 'Максимальная длина - 20 символов' }
];

export const validatePassword: Rule[] = [
    { min: 6, message: 'Минимальная длина - 6 символов' },
    { max: 12, message: 'Максимальная длина - 12 символов' },
];

export const validateEmail: Rule[] = [
    { required: true, message: 'Пожалуйста, введите email' },
    { type: 'email', message: 'Введите корректный email' },
];

export const validateNote: Rule[] = [
    { max: 400, message: 'Максимальная длина - 400 символов' },
];
