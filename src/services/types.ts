import { Moment } from 'moment';

export interface EmployeeFormValues {
    fullName: string;
    birthDate: Moment | null;
    experience: number | null;
    position: string;
    login: string;
    password: string;
    email: string;
    phone: string;
    note: string;
}

export type PhoneMask = {
    placeholder: string;
    format: string;
};

export type EmailMask = {
    rules: Array<{
        required?: boolean;
        message: string;
        type?: string;
    }>;
    props: {
        placeholder: string;
    };
};
