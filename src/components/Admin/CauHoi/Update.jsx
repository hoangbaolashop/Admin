import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { updateCauHoi } from "../../../services/cauHoiAPI";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const Update = (props) => {

    const {
        dataUpdateCauHoi, setDataUpdateCauHoi, fetchListCauHoi, openUpdateCauHoi, setOpenUpdateCauHoi
    } = props
    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);    
    const editorRef = useRef(null);
       
    console.log("editorRef: ", editorRef);
    console.log("editorRef.current: ", editorRef.current);
    
    useEffect(() => {
        if (openUpdateCauHoi && dataUpdateCauHoi?._id) {                              
            const init = {
                _id: dataUpdateCauHoi?._id,
                fullName: dataUpdateCauHoi?.fullName,                
                email: dataUpdateCauHoi?.email,                
                cauHoi: dataUpdateCauHoi?.cauHoi,                
                cauTraLoi: dataUpdateCauHoi.cauTraLoi || '',                
            }
            console.log("init: ", init);            
            form.setFieldsValue(init);     
            
            if (dataUpdateCauHoi?.cauTraLoi) {
                if (editorRef.current) {
                    editorRef.current.setData(dataUpdateCauHoi.cauTraLoi || '');
                }
            }
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateCauHoi, openUpdateCauHoi, ])

    const handleCancel = () => {
        setOpenUpdateCauHoi(false);       
        form.resetFields()
    };

    const handleUpdateCauHoi = async (values) => {

        const { _id, fullName, email, cauHoi, cauTraLoi} = values       
        
        setIsSubmit(true)
        const res = await updateCauHoi( _id, fullName, email, cauHoi, cauTraLoi)

        if(res){
            message.success(res.message);
            handleCancel()           
            await fetchListCauHoi()
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
            title="Sửa thông tin câu hỏi"
            open={openUpdateCauHoi}
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
                    onFinish={handleUpdateCauHoi}
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
                                label="Tên người hỏi"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <Input disabled placeholder="Nhập Nội dung chat..." />
                            </Form.Item>
                        </Col>      

                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Câu hỏi?"
                                name="cauHoi"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <Input.TextArea disabled />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Câu trả lời"
                                name="cauTraLoi"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            {/* <Input.TextArea placeholder="Nhập câu trả lời ở đây" /> */}
                            <CKEditor
                                editor={ClassicEditor}                                        
                                config={{
                                    toolbar: [
                                        'heading', '|',
                                        'bold', 'italic', 'underline', '|',
                                        'fontColor', 'fontFamily', '|', // Thêm màu chữ và kiểu chữ
                                        'link', 'bulletedList', 'numberedList', '|',
                                        'insertTable', '|',
                                        'imageUpload', 'blockQuote', 'undo', 'redo'
                                    ],   
                                    ckfinder: {
                                        uploadUrl: '/api/upload/upload', // Đường dẫn đến API upload
                                        headers: {
                                            "Content-Type": "multipart/form-data",
                                            "upload-type": "book"
                                        },
                                    },                               
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    form.setFieldsValue({ cauTraLoi: data }); // Cập nhật giá trị cho form
                                    console.log("Editor data on change: ", data);
                                }}
                                data={form.getFieldValue('cauTraLoi') || ''} // Thiết lập giá trị từ form
                                onInit={(editor) => {
                                    editorRef.current = editor;
                                    console.log("CKEditor initialized", editor);
                                    
                                    // Set giá trị sau khi khởi tạo
                                    if (dataUpdateCauHoi?.cauTraLoi) {
                                        editor.setData(dataUpdateCauHoi?.cauTraLoi || '');
                                    }
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