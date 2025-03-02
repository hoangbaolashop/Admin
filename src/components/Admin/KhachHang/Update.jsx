import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import './style.scss'
import { fetchAllVoucher } from "../../../services/voucherAPI";
import { updateAccKH } from "../../../services/accKhAPI";
import { IoDiamondSharp } from "react-icons/io5";
import { FaCrown, FaStar, FaTrophy } from "react-icons/fa";
const Update = (props) => {

    const {
        dataUpdateAccKH, setDataUpdateAccKH, fetchListAccKH, openUpdateAccKH, setOpenUpdateAccKH
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);     
    const [dataVoucher, setDataVoucher] = useState([])

    useEffect(() => {
        fetchListVoucher()
    }, [])

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
                <br/> <span>Ngày hết hạn: <span style={{ color: 'green' }}>{item.thoiGianHetHan}</span></span>
            </>
        ),
    }))

    useEffect(() => {
        if (openUpdateAccKH && dataUpdateAccKH) {                   
            const init = {
                id: dataUpdateAccKH._id,                                                     
                email: dataUpdateAccKH.email,                                                     
                fullName: dataUpdateAccKH.fullName,                                                     
                phone: dataUpdateAccKH.phone,                                                     
                quayMayManCount: dataUpdateAccKH.quayMayManCountc || 0,                                                     
                hangTV: ["Bạc", "Vàng", "Bạch Kim", "Kim Cương"].includes(dataUpdateAccKH.hangTV) 
                ? dataUpdateAccKH.hangTV 
                : "Bạc", // Giá trị mặc định nếu không hợp lệ                                             
                IdVoucher: dataUpdateAccKH.IdVoucher.map(item => item._id)
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

        const { id, fullName, IdVoucher, quayMayManCount, hangTV} = values

        console.log("id, fullName, IdVoucher: ", id, fullName, IdVoucher);
        
                
        setIsSubmit(true)
        const res = await updateAccKH(id, fullName, IdVoucher, quayMayManCount, hangTV)

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
            title="Sửa thông tin tài khoản"
            open={openUpdateAccKH}
            onOk={() => form.submit()} 
            onCancel={() => handleCancel()}
            maskClosable={false}
            confirmLoading={isSubmit}
            okText={"Xác nhận Sửa"}
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

                        <Col span={12} md={12} sm={24} xs={24}>
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

                        <Col span={12} md={12} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Họ và tên"
                                name="fullName"    
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}                            
                            >
                            <Input placeholder="Nhập họ và tên..." />
                            </Form.Item>
                        </Col>

                        <Col span={12} md={12} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Số điện thoại"
                                name="phone"    
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

                        <Col span={12} md={12} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Số lượt quay số trúng thưởng"
                                name="quayMayManCount"    
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}                              
                            >
                            <InputNumber style={{width: "100%"}} min={0} max={100} />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Hạng thành viên"
                                name="hangTV"    
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}                              
                            >
                                <Select placeholder="Chọn hạng thành viên" allowClear>
                                    <Select.Option value="Bạc">
                                        <FaTrophy size={20} style={{ color: "#CD7F32", marginRight: 8 }} /> Hạng Bạc
                                    </Select.Option>
                                    <Select.Option value="Vàng">
                                        <FaCrown size={20} style={{ color: "gold", marginRight: 8 }} /> Hạng Vàng
                                    </Select.Option>
                                    <Select.Option value="Bạch Kim">
                                        <FaStar size={20} style={{ color: "#E5E4E2", marginRight: 8 }} /> Hạng Bạch Kim
                                    </Select.Option>
                                    <Select.Option value="Kim Cương">
                                        <IoDiamondSharp size={20} style={{ color: "#00BFFF", marginRight: 8 }} /> Hạng Kim Cương
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                label="Chọn voucher"
                                name="IdVoucher"
                                layout="vertical"                                
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn voucher"
                                    mode="multiple"
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