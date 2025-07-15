import React from 'react';
import EmployeeForm from './components/EmployeeForm';
import 'antd/dist/reset.css';

const App: React.FC = () => {
    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Форма</h1>
            <EmployeeForm />
        </div>
    );
};

export default App;
