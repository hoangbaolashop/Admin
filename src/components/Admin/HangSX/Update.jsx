import { Col, Divider, Form, Input, message, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import './style.scss'
import { useDispatch, useSelector } from "react-redux";
import { fetchListCategory } from "../../../redux/TheLoai/theLoaiSlice";
import { updateHangSX } from "../../../services/hangSXAPI";
const Update = (props) => {

    const {
        dataUpdateHSX, setDataUpdateHSX, fetchListHSX, openUpdateHSX, setOpenUpdateHSX
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);   
    
    const dispatch = useDispatch()
    const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    console.log("dataTheLoai: ", dataTheLoai);
    console.log("dataUpdateHSX: ", dataUpdateHSX);
    
    let x = dataTheLoai?.map(item => ({                                                                                
        value: item._id, // Lưu _id làm giá trị của option
        label: item.TenLoaiSP, // Hiển thị TenLoaiSP là tên thể loại
    }))
    console.log("x: ", x);
    

    useEffect(() => {
        dispatch(fetchListCategory())
    }, [])

    useEffect(() => {
        if (openUpdateHSX && dataUpdateHSX) {                   
            const init = {
                TenHangSX: dataUpdateHSX.TenHangSX,                
                // IdLoaiSP: dataUpdateHSX.IdLoaiSP.map(item => (
                //         <span key={item._id}>{item.TenLoaiSP}</span>
                // ))                       
                IdLoaiSP: dataUpdateHSX.IdLoaiSP.map(item => item._id)
            }
            console.log("init: ", init);
            form.setFieldsValue(init);            
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateHSX, openUpdateHSX])

    const handleCancel = () => {
        setOpenUpdateHSX(false);
        form.resetFields()
    };

    const handleUpdateHSX = async (values) => {

        const { TenHangSX, IdLoaiSP} = values
        console.log("TenHangSX: ", TenHangSX);
        console.log("IdLoaiSP: ", IdLoaiSP);
                
        setIsSubmit(true)
        const res = await updateHangSX(TenHangSX, IdLoaiSP)

        if(res){
            message.success(res.message);
            handleCancel()
            await fetchListHSX()
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
            title="Sửa thông tin hãng sản phẩm"
            open={openUpdateHSX}
            onOk={() => form.submit()} 
            onCancel={() => handleCancel()}
            maskClosable={false}
            confirmLoading={isSubmit}
            okText={"Xác nhận Sửa"}
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
                    onFinish={handleUpdateHSX}
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
                            <Input placeholder="Nhập hãng sản phẩm..." disabled />
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
export default Update