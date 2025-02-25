import { Col, DatePicker, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Upload } from "antd";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import './style.scss'
import { createVoucher } from "../../../services/voucherAPI";
import moment from "moment";

const Create = (props) => {

    const {
        openCreateVoucher, setOpenCreateVoucher, fetchListVoucher
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);   

    const handleCancel = () => {
        setOpenCreateVoucher(false);        
        form.resetFields()
    };

    const handleCreateVoucher = async (values) => {

        const {code, dieuKien, giamGia, thoiGianHetHan} = values   
        
        const appointmentDate = thoiGianHetHan.format('DD-MM-YYYY'); 
        console.log("thoiGianHetHan: ", appointmentDate);
        
       
        setIsSubmit(true)
        const res = await createVoucher(code, dieuKien, giamGia, appointmentDate)

        if(res && res.data) {
            message.success(res.message)
            handleCancel()
            await fetchListVoucher()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }        
        setIsSubmit(false)
    }

    const formatter = value => {
        if (!value) return '10000'; // For empty or undefined input
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`; // Format number as VND
      };
    
    return (
        <Modal
            title="Tạo mới thông tin voucher"
            open={openCreateVoucher}
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
                        remember: true,
                    }}
                    onFinish={handleCreateVoucher}
                    autoComplete="off"
                    loading={isSubmit}
                >
                    <Row gutter={[20,5]}>
                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Voucher"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <Input placeholder="Nhập Voucher..." />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Điều kiện giảm giá (điều kiện > x ---> x: tổng tiền đơn hàng)"
                                name="dieuKien"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <InputNumber min={10000} formatter={formatter} style={{width: "100%"}} placeholder="Nhập Điều kiện giảm giá..." />
                            </Form.Item>
                        </Col>

                        <Col span={12} md={12} sm={12} xs={12}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Giảm giá (%)"
                                name="giamGia"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <InputNumber min={1} max={100} style={{width: "100%"}} placeholder="Nhập số giảm giá..." />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={12} sm={12} xs={12}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Thời gian hết hạn"
                                name="thoiGianHetHan"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                                <DatePicker
                                        placeholder="Chọn ngày hết hạn"
                                        style={{ width: "100%" }}
                                        format="DD/MM/YYYY" // Định dạng ngày/tháng/năm
                                        disabledDate={current => current < moment().startOf('day')} // Không cho chọn ngày quá khứ
                                    />
                            </Form.Item>
                        </Col>
                        
                    </Row>

                </Form>
            
        </Modal>
    )
}
export default Create