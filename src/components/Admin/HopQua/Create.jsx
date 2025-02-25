import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import './style.scss'
import { createHopQua } from "../../../services/hopQuaAPI";
import { fetchAllVoucher } from "../../../services/voucherAPI";

const Create = (props) => {

    const {
        openCreateHopQua, setOpenCreateHopQua, fetchListHopQua
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);   
    const [dataVoucher, setDataVoucher] = useState([])

    const handleCancel = () => {
        setOpenCreateHopQua(false);        
        form.resetFields()
    };

    const handleCreateHopQua = async (values) => {

        const {tenHopQua, messageHopQua, IdVoucher, IdKH} = values        
       
        setIsSubmit(true)
        const res = await createHopQua(tenHopQua, messageHopQua, IdVoucher, IdKH)

        if(res && res.data) {
            message.success(res.message)
            handleCancel()
            await fetchListHopQua()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }        
        setIsSubmit(false)
    }
   
    
    useEffect(() => {
        fetchListVoucher()
    }, [])
    useEffect(() => {        
        const data = { messageHopQua: "Chúc mừng bạn đã nhận được quà của chúng tôi 😍" };
        form.setFieldsValue(data);
    }, []);
    
    const fetchListVoucher = async () => {
        let query = `page=1&limit=100`             
        const res = await fetchAllVoucher(query)
        if (res && res.data) {
            setDataVoucher(res.data)
        }
    }
    
    let x = dataVoucher?.map(item => ({                                                                                
        value: item._id, 
        label: (
            <>
                <span style={{ color: 'navy' }}>{item.code}</span> - tổng giá trị đơn hàng lớn hơn &nbsp;
                <span style={{ color: 'red' }}>
                    {Number(item.dieuKien).toLocaleString()}đ
                </span>
                {' '} - <span style={{ color: 'navy' }}>{item.giamGia}%</span>
            </>
        ),
    }))
    
    return (
        <Modal
            title="Tạo mới thông tin Hộp quà"
            open={openCreateHopQua}
            onOk={() => form.submit()} 
            onCancel={() => handleCancel()}
            maskClosable={false}
            confirmLoading={isSubmit}
            okText={"Xác nhận tạo mới"}
            cancelText="Huỷ"
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
                        messageHopQua: "Chúc mừng bạn đã nhận được quà của chúng tôi 😍",
                    }}
                    onFinish={handleCreateHopQua}
                    autoComplete="off"
                    loading={isSubmit}
                >
                    <Row gutter={[20,5]}>
                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Tên hộp quà"
                                name="tenHopQua"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <Input placeholder="Nhập Tên hộp quà..." />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Nội dung chat"
                                name="messageHopQua"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <Input placeholder="Nhập Nội dung chat..." />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Giảm giá (%)"
                                name="IdVoucher"
                                rules={[
                                    {
                                        // required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue={''}
                                    showSearch
                                    placeholder="Không chọn gì nếu hộp quà này rỗng"
                                    style={{
                                        width: '100%',
                                    }}       
                                    options={[
                                        { label: 'Không chọn gì', value: null}, // Tùy chọn rỗng
                                        ...x, // Danh sách options khác
                                    ]}                                                      
                                />
                            </Form.Item>
                        </Col>
                        
                    </Row>

                </Form>
            
        </Modal>
    )
}
export default Create