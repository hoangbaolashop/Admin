import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotPermittedKoCoQuyen = () => {
    const navigate = useNavigate();
    return (
        <Result
            status="403"
            title="403"
            subTitle="Không có quyền truy cập vào đây!"
            extra={<Button type="primary"
                onClick={() => navigate('/admin')}
            >Back Admin</Button>}
        />
    )
};

export default NotPermittedKoCoQuyen;