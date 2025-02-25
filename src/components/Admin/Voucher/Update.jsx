import { Col, DatePicker, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import './style.scss'
import { updateVoucher } from "../../../services/voucherAPI";
import moment from "moment";

const Update = (props) => {

    const {
        dataUpdateVoucher, setDataUpdateVoucher, fetchListVoucher, openUpdateVoucher, setOpenUpdateVoucher
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);    

    useEffect(() => {
        if (openUpdateVoucher && dataUpdateVoucher?._id) {                              
            const init = {
                _id: dataUpdateVoucher._id,
                code: dataUpdateVoucher.code,                
                dieuKien: dataUpdateVoucher.dieuKien,                
                giamGia: dataUpdateVoucher.giamGia,                                                 
                thoiGianHetHan: dataUpdateVoucher.thoiGianHetHan
                ? moment(dataUpdateVoucher.thoiGianHetHan, "DD/MM/YYYY").format("YYYY-MM-DD")
                : null     
            }
            console.log("init: ", init);            
            form.setFieldsValue(init);            
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateVoucher, openUpdateVoucher])

    const handleCancel = () => {
        setOpenUpdateVoucher(false);       
        form.resetFields()
    };

    const handleUpdateVoucher = async (values) => {

        const { _id, code, dieuKien, giamGia, thoiGianHetHan} = values       

        const formattedDate = thoiGianHetHan ? moment(thoiGianHetHan, "YYYY-MM-DD").format("DD / MM / YYYY") : null  
        console.log("thoiGianHetHan:", thoiGianHetHan);       
        console.log("Formatted Date:", formattedDate);

        
        setIsSubmit(true)
        const res = await updateVoucher( _id, code, dieuKien, giamGia, formattedDate)

        if(res){
            message.success(res.message);
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
            title="Sửa thông tin Voucher"
            open={openUpdateVoucher}
            onOk={() => form.submit()} 
            onCancel={() => handleCancel()}
            maskClosable={false}
            confirmLoading={isSubmit}
            okText={"Xác nhận sửa"}
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
                    onFinish={handleUpdateVoucher}
                    autoComplete="off"
                    loading={isSubmit}
                >
                    <Row gutter={[20,5]}>
                        <Col hidden>
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="ID"
                                name="_id"
                            >
                                <Input />
                            </Form.Item>
                        </Col>

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
                                <Input
                                    min={moment().format("YYYY-MM-DD")} // Giới hạn ngày bắt đầu từ ngày hôm nay
                                    type="date"
                                    format="DD/MM/YYYY" 
                                />
                            </Form.Item>
                        </Col>                          
                            
                    </Row>

                </Form>
            
        </Modal>
    )
}
export default Update