import { Col, Divider, Form, Input, message, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { fetchAllRole, updateAccAdmin } from "../../../services/loginAdminAPI";
const Update = (props) => {

    const {
        dataUpdateAccKH, setDataUpdateAccKH, fetchListAccKH, openUpdateAccKH, setOpenUpdateAccKH
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);  
    const [dataRole, setDataRole] = useState([])
    
    useEffect(() => {
        fetchListRole()
    }, [])

    const fetchListRole = async () => {
        const res = await fetchAllRole()
        if (res && res.data) {
            setDataRole(res.data)
        }
    }
    
    let x = dataRole?.map(item => ({                                                                                
        value: item._id, 
        label: (
            <>
                <span style={{ color: 'navy' }}>{item.name}</span>
            </>
        ),
    }))      

    useEffect(() => {
        if (openUpdateAccKH && dataUpdateAccKH) {                   
            const init = {
                id: dataUpdateAccKH._id,                                                     
                roleId: dataUpdateAccKH.roleId,                                                     
                email: dataUpdateAccKH.email,                                                     
                lastName: dataUpdateAccKH.lastName,                                                     
                firstName: dataUpdateAccKH.firstName,                                                     
                
            }
            console.log("init: ", init);
            form.setFieldsValue(init);            
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateAccKH, openUpdateAccKH])

    const handleCancel = () => {
        setOpenUpdateAccKH(false);
        form.resetFields()
    };

    const handleUpdateAccKH = async (values) => {

        const { id, roleId, lastName, firstName} = values

        console.log("id, roleId: ", id, roleId);
        
                
        setIsSubmit(true)
        const res = await updateAccAdmin(id, roleId, lastName, firstName)

        if(res){
            message.success(res.message);
            handleCancel()
            await fetchListAccKH()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.error
            })
        }        
        setIsSubmit(false)
    }   

    return (
        <Modal
            title="Phân quyền tài khoản"
            open={openUpdateAccKH}
            onOk={() => form.submit()} 
            onCancel={() => handleCancel()}
            maskClosable={false}
            confirmLoading={isSubmit}
            okText={"Xác nhận phân quyền"}
            cancelText="Huỷ"
            width={600}
        >
            <Divider />
                <Form
                    form={form}
                    name="basic"        
                    layout="vertical"                
                    style={{
                        maxWidth: "100%",
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={handleUpdateAccKH}
                    autoComplete="off"
                    loading={isSubmit}
                >
                    <Row gutter={[20,5]}>
                        <Col hidden>
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="ID"
                                name="id"
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Email"
                                name="email"      
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}                            
                            >
                            <Input disabled />
                            </Form.Item>
                        </Col> 

                        <Col span={12} md={12} sm={12} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Họ"                                
                                name="lastName"    
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}                            
                            >
                            <Input placeholder="Nhập họ..." />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={12} sm={12} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Tên"
                                name="firstName"    
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}                            
                            >
                            <Input placeholder="Nhập tên..." />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Quyền truy cập"
                                name="roleId"    
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}                            
                            >
                            <Select
                                showSearch
                                placeholder="Chọn quyền truy cập"
                                style={{
                                    width: '100%',
                                }}       
                                options={x}                                                          
                            />
                            </Form.Item>
                        </Col>                        
                                          
                    </Row>

                </Form>
            
        </Modal>
    )
}
export default Update