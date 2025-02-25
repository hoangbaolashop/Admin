import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import './style.scss'
import { updateHopQua } from "../../../services/hopQuaAPI";
import { fetchAllVoucher } from "../../../services/voucherAPI";

const Update = (props) => {

    const {
        dataUpdateHopQua, setDataUpdateHopQua, fetchListHopQua, openUpdateHopQua, setOpenUpdateHopQua
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
            </>
        ),
    }))

    useEffect(() => {
        if (openUpdateHopQua && dataUpdateHopQua?._id) {                              
            const init = {
                _id: dataUpdateHopQua?._id,
                tenHopQua: dataUpdateHopQua?.tenHopQua,                
                messageHopQua: dataUpdateHopQua?.messageHopQua,                
                IdVoucher: dataUpdateHopQua?.IdVoucher?._id                                              
            }
            console.log("init: ", init);            
            form.setFieldsValue(init);            
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateHopQua, openUpdateHopQua])

    const handleCancel = () => {
        setOpenUpdateHopQua(false);       
        form.resetFields()
    };

    const handleUpdateHopQua = async (values) => {

        const { _id, tenHopQua, messageHopQua, IdVoucher, IdKH} = values       
        
        setIsSubmit(true)
        const res = await updateHopQua( _id, tenHopQua, messageHopQua, IdVoucher, IdKH)

        if(res){
            message.success(res.message);
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
       
    return (
        <Modal
            title="Sửa thông tin Hộp quà"
            open={openUpdateHopQua}
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
                    onFinish={handleUpdateHopQua}
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
export default Update