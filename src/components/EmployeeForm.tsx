import React, { useState, useEffect, useRef, useCallback } from 'react';
import { isEqual } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import {
    Form,
    Input,
    DatePicker,
    InputNumber,
    Select,
    Button,
    Row,
    Col,
    message,
    Spin, InputProps
} from 'antd';
import moment, { Moment } from 'moment';
import { PatternFormat } from 'react-number-format';
import {
    validateFullName,
    validateBirthDate,
    getExperienceValidator,
    validatePosition,
    validateLogin,
    validatePassword,
    validateEmail,
    validateNote,
} from '../services/validationService';
import { phoneMask, emailMask } from '../services/masks';
import { EmployeeFormValues } from '../services/types';

const { Option } = Select;
const { TextArea } = Input;

const positions: string[] = [
    'Директор',
    'Менеджер по работе с клиентами',
    'Специалист тех. поддержки',
];

const fetchMockData = (): Promise<EmployeeFormValues> => {
    return new Promise((resolve): void => {
        setTimeout((): void => {
            resolve({
                fullName: 'Иванов Иван Иванович',
                birthDate: moment('1990-01-01'),
                experience: 5,
                position: positions[1],
                login: 'ivanov',
                password: 'password123',
                email: 'ivanov@example.com',
                phone: '+7999123456',
                note: 'Пример примечания',
            });
        }, 1500);
    });
};

const EmployeeForm: React.FC = () => {
    const [form] = Form.useForm<EmployeeFormValues>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [age, setAge] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const initialValuesRef = useRef<EmployeeFormValues | null>(null);
    const [formValuesSnapshot, setFormValuesSnapshot] = useState<EmployeeFormValues | null>(null);
    const [formChanged, setFormChanged] = useState<boolean>(false);

    const calculateAge = useCallback((birthDate: Moment | null): void => {
        if (!birthDate) return;
        const years = moment().diff(birthDate, 'years');
        setAge(years);
    }, []);

    const handleValuesChange = useCallback(
        (changedValues: Partial<EmployeeFormValues>, allValues: EmployeeFormValues): void => {
            if (!formValuesSnapshot) return;
            setFormChanged(!isEqual(allValues, formValuesSnapshot));
        },
        [formValuesSnapshot]
    );

    const loadFormData = useCallback(async (): Promise<void> => {
        try {
            const data: EmployeeFormValues = await fetchMockData();
            initialValuesRef.current = data;
            calculateAge(data.birthDate);

            form.setFieldsValue(data);
            setFormValuesSnapshot(data);
        } catch (error) {
            message.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, [form, calculateAge]);

    useEffect((): void => {
        loadFormData().then()
    }, [loadFormData]);

    const handleBirthDateChange = (date: Dayjs | null): void => {
        calculateAge(date ? moment(date.toDate()) : null);
        form.validateFields(['experience']).then((): void => {
            setFormValuesSnapshot(prev => ({
                ...prev,
                birthDate: date ? moment(date.toDate()) : null
            }));
        });
    };

    const handleEdit = (): void => {
        setIsEditing(true);
        const currentValues: EmployeeFormValues = form.getFieldsValue();
        setFormValuesSnapshot(currentValues);
        setFormChanged(false);
    };
    const handleCancel = (): void => {
        form.setFieldsValue(initialValuesRef.current || {});
        setIsEditing(false);
        setFormChanged(false);
    };

    const handleSubmit = async (values: EmployeeFormValues): Promise<void> => {
        setSubmitLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            initialValuesRef.current = values;
            setFormValuesSnapshot(values);
            setIsEditing(false);
            setFormChanged(false);
            console.log('Обновлённые данные ', values)
            message.success('Данные успешно сохранены');
        } catch (error) {
            message.error('Ошибка сохранения данных');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading)
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large">
                    <div style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)' }} />
                </Spin>
            </div>
        );


    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            initialValues={initialValuesRef.current || {}}
        >
            <Row>
                <Col xs={24} md={24}>
                    <Form.Item name="fullName" label="ФИО" rules={validateFullName}>
                        <Input disabled={!isEditing} placeholder="Введите ФИО" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="birthDate"
                        label="Дата рождения"
                        rules={validateBirthDate}
                    >
                        <DatePicker
                            disabled={!isEditing}
                            format="DD.MM.YYYY"
                            style={{ width: '100%' }}
                            placeholder="Выберите дату"
                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                            onChange={handleBirthDateChange}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="experience"
                        label="Стаж (лет)"
                        rules={getExperienceValidator(age)}
                    >
                        <InputNumber
                            disabled={!isEditing}
                            min={0}
                            max={100}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col xs={24} md={24}>
                    <Form.Item name="position" label="Должность" rules={validatePosition}>
                        <Select disabled={!isEditing} placeholder="Выберите должность">
                            {positions.map((pos) => (
                                <Option key={pos} value={pos}>
                                    {pos}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item name="login" label="Логин" rules={validateLogin}>
                        <Input disabled={!isEditing} placeholder="Введите логин" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="password" label="Пароль" rules={validatePassword}>
                        <Input.Password disabled={!isEditing} placeholder="Введите пароль" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item name="email" label="Email" rules={validateEmail}>
                        <Input
                            disabled={!isEditing}
                            placeholder={emailMask.props.placeholder}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="phone" label="Номер телефона">
                        <PatternFormat
                            customInput={Input as React.ComponentType<InputProps>}
                            disabled={!isEditing}
                            format={phoneMask.format}
                            mask="_"
                            placeholder={phoneMask.placeholder}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="note" label="Примечание" rules={validateNote}>
                <TextArea
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Введите примечание"
                />
            </Form.Item>

            <Form.Item>
                {isEditing ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                            disabled={!formChanged || form.getFieldsError().some(field => field.errors.length > 0)}
                        >
                            Сохранить
                        </Button>
                        <Button onClick={handleCancel} disabled={!formChanged}>
                            Отмена
                        </Button>
                    </div>
                ) : (
                    <Button type="primary" onClick={handleEdit}>
                        Изменить
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
};

export default EmployeeForm;
