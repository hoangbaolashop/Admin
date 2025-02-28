import { Col, Divider, Form, Input, message, Modal, notification, Row, Select } from "antd"
import { useEffect, useState } from "react";
import { updateOrder } from "../../../services/historyOrderAPI";
import './css.css'
const ModalUpdate = (props) => {

    const {
        openUpdateOrder, setOpenUpdateOrder, dataUpdateOrder, setDataUpdateOrder, findAllHistoryOrder
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);    
    const [dataTinhTrangDonHang, setDataTinhTrangDonHang] = useState('');    
    const [dataTinhTrangThanhToan, setDataTinhTrangThanhToan] = useState('');       
    
    useEffect(() => {
        setDataTinhTrangDonHang(dataUpdateOrder?.TinhTrangDonHang)
        setDataTinhTrangThanhToan(dataUpdateOrder?.TinhTrangThanhToan)

        if (openUpdateOrder && dataUpdateOrder?._id) {                              
            const init = {
                _id: dataUpdateOrder?._id,
                TinhTrangDonHang: dataUpdateOrder?.TinhTrangDonHang,                
                TinhTrangThanhToan: dataUpdateOrder?.TinhTrangThanhToan,                
                urlTTGH: dataUpdateOrder?.urlTTGH,                
            }
            console.log("init: ", init);            
            form.setFieldsValue(init);            
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateOrder, openUpdateOrder])

    const handleCancel = () => {
        setOpenUpdateOrder(false);       
        form.resetFields()
        setDataUpdateOrder(null)
        setDataTinhTrangDonHang('')
        setDataTinhTrangThanhToan('')
    };

    const handleUpdateOrder = async (values) => {

        const { _id, TinhTrangDonHang, TinhTrangThanhToan, urlTTGH} = values       
        
        setIsSubmit(true)
        const res = await updateOrder( _id, TinhTrangDonHang, TinhTrangThanhToan, urlTTGH)
        if(res && res.data){
            message.success(res.message);
            handleCancel()           
            await findAllHistoryOrder()
        } else {
            notification.warning({
                message: 'Cập nhật đơn hàng.',
                description: res.message
            })
        }        
        setIsSubmit(false)
    }  

    const onChangeDataTinhTrangDonHang = (e) => {
        setDataTinhTrangDonHang(e)
    };
    const onChangeDataTinhTrangThanhToan = (e) => {
        setDataTinhTrangThanhToan(e)
    };
  return (
    <Modal
        title={`Sửa thông tin đơn hàng #${dataUpdateOrder?._id.slice(-6)} của bạn: ${dataUpdateOrder?.lastName} ${dataUpdateOrder?.firstName}`}
        open={openUpdateOrder}
        onOk={() => form.submit()} 
        onCancel={() => handleCancel()}
        maskClosable={false}
        confirmLoading={isSubmit}
        okText={"Xác nhận sửa"}
        cancelText="Huỷ"
        style={{top: 200}}
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
            onFinish={handleUpdateOrder}
            autoComplete="off"
            loading={isSubmit}
        >
            <Row gutter={[20,5]}>
                <Col hidden><Form.Item hidden name="_id" > <Input /> </Form.Item></Col>

                <Col span={24} md={24} sm={24} xs={24}>
                    <Form.Item
                        hasFeedback
                        layout="vertical"
                        label="Tình trạng đơn hàng"
                        name="TinhTrangDonHang"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập đầy đủ thông tin!',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn Tình trạng đơn hàng"
                            value={dataTinhTrangDonHang}
                            onChange={(e) => onChangeDataTinhTrangDonHang(e)}
                            style={{
                                width: '100%',
                            }}
                            options={[
                                {
                                  value: 'Chưa giao hàng',
                                  label: 'Chưa giao hàng',
                                },
                                {
                                  value: 'Đang giao hàng',
                                  label: 'Đang giao hàng',
                                },
                                {
                                  value: 'Đã giao hàng',
                                  label: 'Đã giao hàng',
                                },
                            ]}
                            filterOption={(input, option) => {
                                return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                            }}  
                        />
                    </Form.Item>
                </Col>

                <Col span={24} md={24} sm={24} xs={24}>
                    <Form.Item
                        hasFeedback
                        layout="vertical"
                        label="Tình trạng thanh toán"
                        name="TinhTrangThanhToan"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập đầy đủ thông tin!',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn Tình trạng thanh toán"
                            value={dataTinhTrangThanhToan}
                            onChange={(e) => onChangeDataTinhTrangThanhToan(e)}
                            style={{
                                width: '100%',
                            }}
                            options={[
                                {
                                    value: 'Chưa Thanh Toán',
                                    label: 'Chưa Thanh Toán',
                                },
                                {
                                    value: 'Đã Thanh Toán',
                                    label: 'Đã Thanh Toán',
                                },
                                {
                                    value: 'Chờ hoàn tiền',
                                    label: 'Chờ hoàn tiền',
                                },
                                {
                                    value: 'Đã hoàn tiền',
                                    label: 'Đã hoàn tiền',
                                },
                            ]}
                            filterOption={(input, option) => {
                                return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                            }}  
                        />
                    </Form.Item>
                </Col>
                <Col span={24} md={24} sm={24} xs={24}>
                    <Form.Item
                        hasFeedback
                        layout="vertical"
                        label="Link tình trạng giao hàng (nếu có)"
                        name="urlTTGH"
                        rules={[
                            {
                                required: false,
                                message: 'Vui lòng nhập đầy đủ thông tin!',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập link tình trạng giao hàng..." />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </Modal>
  )
}
export default ModalUpdate