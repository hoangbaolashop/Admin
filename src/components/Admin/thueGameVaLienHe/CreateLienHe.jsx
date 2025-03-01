import { Col, Divider, Form, Input, message, Modal, notification, Row } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS giao diện
import { createLienHe } from "../../../services/thueGameLienHeAPI";
const CreateLienHe = ({openCreateLienHe, setOpenCreateLienHe, fetchOneLienHes}) => {

  const [form] = Form.useForm()
  const [isSubmit, setIsSubmit] = useState(false);

  const cancel = () => {
    setOpenCreateLienHe(false)
    form.resetFields()
  }

   // Định nghĩa các module đầy đủ chức năng
   const modules = {
    toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Kích thước tiêu đề
    ["bold", "italic", "underline", "strike"], // Định dạng chữ
    [{ color: [] }, { background: [] }], // Màu chữ và màu nền
    [{ script: "sub" }, { script: "super" }], // Chỉ số trên/dưới
    ["blockquote", "code-block"], // Khối trích dẫn, mã
    [{ list: "ordered" }, { list: "bullet" }], // Danh sách số/bullet
    [{ indent: "-1" }, { indent: "+1" }], // Thụt lề
    [{ align: [] }], // Căn chỉnh
    ["link", "image", "video"], // Chèn liên kết, ảnh, video
    ["clean"], // Xóa định dạng
    ],
};

// Các định dạng được hỗ trợ
const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
];

const handleCreateLienHe = async (values) => {
    const {text} = values
    setIsSubmit(true)
    const res = await createLienHe(text)
    if(res && res.data) {
        message.success(res.message)
        cancel()
        await fetchOneLienHes()
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
        style={{
            top: 20,
            left: 100
        }}
        title="Tạo nội dung liên hệ"
        centered
        open={openCreateLienHe}
        onOk={() => form.submit()}
        onCancel={() => cancel()}
        width={800}
        okText={"Xác nhận tạo"}
        cancelText="Huỷ"
        maskClosable={false}
        confirmLoading={isSubmit}
    >
        <Divider/>
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
            onFinish={handleCreateLienHe}
            autoComplete="off"
            loading={isSubmit}
        >
            <Row gutter={[20, 10]}>
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
                <Col md={24}>
                    <Form.Item
                        layout="vertical"
                        label="Nội dung"
                        name="text"    
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập nội dung!',
                            },                                        
                        ]}                                
                    >
                        <ReactQuill
                            theme="snow"                            
                            modules={modules} // Gắn modules đầy đủ
                            formats={formats} // Gắn các định dạng
                            placeholder="Vui lòng nhập nội dung!"
                            
                        />    
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </Modal>
  )
}
export default CreateLienHe