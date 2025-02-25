import { Col, Divider, Form, Input, message, Modal, notification, Row } from "antd";
import { useEffect, useState } from "react";
import './style.scss'
import { Select, Tag } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { fetchListCategory } from "../../../redux/TheLoai/theLoaiSlice";
import { createHangSX } from "../../../services/hangSXAPI";


const Create = (props) => {

    const {
        openCreateHSX, setOpenCreateHSX, fetchListHSX
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    console.log("dataTheLoai: ", dataTheLoai);
    

    useEffect(() => {
        dispatch(fetchListCategory())
    }, [])


    const handleCancel = () => {
        setOpenCreateHSX(false);
        form.resetFields()
    };

    const handleCreateHSX = async (values) => {

        const {TenHangSX, IdLoaiSP} = values      
        console.log("TenHangSX, IdLoaiSP: ", {TenHangSX, IdLoaiSP});
          
        
        setIsSubmit(true)
        const res = await createHangSX(TenHangSX, IdLoaiSP)
        console.log("res: ", res);

        if(res && res.data) {
            message.success(res.message)
            handleCancel()
            await fetchListHSX()
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
            title="Tạo mới thông tin hãng sản phẩm"
            open={openCreateHSX}
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
                    onFinish={handleCreateHSX}
                    autoComplete="off"
                    loading={isSubmit}
                >
                    <Row gutter={[20,5]}>
                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Tên hãng sản phẩm"
                                name="TenHangSX"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <Input placeholder="Nhập hãng sản phẩm..." />
                            </Form.Item>
                        </Col> 

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                label="Chọn thể loại"
                                name="IdLoaiSP"
                                layout="vertical"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn thể loại!',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn thể loại"
                                    mode="multiple"
                                    style={{
                                        width: '100%',
                                    }}       
                                    options={dataTheLoai?.map(item => ({
                                        value: item._id, // Lưu _id làm giá trị của option
                                        label: item.TenLoaiSP, // Hiển thị TenLoaiSP là tên thể loại
                                    }))}   
                                    filterOption={(input, option) => {
                                        return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                                    }}                          
                                />
                            </Form.Item>
                        </Col>                       
                    </Row>

                </Form>
            
        </Modal>
    )
}
export default Create