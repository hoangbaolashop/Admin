import { Col, Divider, Form, Input, message, Modal, notification, Row, Upload } from "antd";
import { useState } from "react";
import { createTheLoai } from "../../../services/loaiSPAPI";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { uploadImg } from "../../../services/uploadAPI";
import './style.scss'
import { v4 as uuidv4 } from 'uuid';

const Create = (props) => {

    const {
        openCreateTL, setOpenCreateTL, fetchListTL
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);

    const [imageUrl, setImageUrl] = useState('');    
    const [imageUrlAnh, setImageUrlAnh] = useState('');    
    const [loading, setLoading] = useState(false);
    // hiển thị hình ảnh dạng modal khi upload muốn xem lại
    const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
    const [isImagePreviewVisibleAnh, setIsImagePreviewVisibleAnh] = useState(false);

    const handleCancel = () => {
        setOpenCreateTL(false);
        setImageUrl('')
        setImageUrlAnh('')
        form.resetFields()
    };

    const handleCreateTL = async (values) => {

        const {TenLoaiSP, Icon} = values

        console.log("TenLoaiSP: ", TenLoaiSP);
        

        if (!imageUrl) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload Icon'
            })
            return;
        }
        if (!imageUrlAnh) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload hình ảnh'
            })
            return;
        }

        const hinhAnh = imageUrl.split('/').pop(); // Lấy tên file từ URL
        const hinhAnhAnh = imageUrlAnh.split('/').pop(); // Lấy tên file từ URL
        console.log("hinhanh: ", hinhAnh);

        setIsSubmit(true)
        const res = await createTheLoai(TenLoaiSP, hinhAnh, hinhAnhAnh)
        console.log("res chucvu: ", res);

        if(res && res.data) {
            message.success(res.message)
            handleCancel()
            await fetchListTL()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }        
        setIsSubmit(false)
    }

    // upload ảnh    
    const handleUploadFileImage = async ({ file, onSuccess, onError }) => {

        setLoading(true);
        try {
            const res = await uploadImg(file);
            console.log("res upload: ", res);            
            if (res) {
                setImageUrl(res.url); // URL của hình ảnh từ server
                onSuccess(file);
                // setDataImage()
                // message.success('Upload thành công');
            } else {
                onError('Đã có lỗi khi upload file');
            }            
        } catch (error) {
            console.error(error);
            message.error('Upload thất bại');
            onError(error);
        } finally {
            setLoading(false);
        }
    };
    const handleUploadFileImageAnh = async ({ file, onSuccess, onError }) => {

        setLoading(true);
        try {
            const res = await uploadImg(file);
            console.log("res upload: ", res);            
            if (res) {
                setImageUrlAnh(res.url); // URL của hình ảnh từ server
                onSuccess(file);
                // setDataImage()
                // message.success('Upload thành công');
            } else {
                onError('Đã có lỗi khi upload file');
            }            
        } catch (error) {
            console.error(error);
            message.error('Upload thất bại');
            onError(error);
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên hình ảnh JPG/PNG!');
        }
        return isJpgOrPng;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`upload file ${info.file.name} thành công`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload file thất bại!`);
        }
    };

    const handleRemoveFile = (file) => {
        setImageUrl(''); // Reset URL khi xóa file
        setImageUrlAnh(''); // Reset URL khi xóa file
        message.success(`${file.name} đã được xóa`);
    };

    // mở đóng modal hình ảnh
    const handlePreview = async () => {
        // if (imageUrl) {
        // }
        setIsImagePreviewVisible(true);
    };
    const handlePreviewAnh = async () => {
        // if (imageUrl) {
        // }
        setIsImagePreviewVisibleAnh(true);
    };

    return (
        <Modal
            title="Tạo mới thông tin thể loại"
            open={openCreateTL}
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
                    onFinish={handleCreateTL}
                    autoComplete="off"
                    loading={isSubmit}
                >
                    <Row gutter={[20,5]}>
                        <Col span={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                hasFeedback
                                layout="vertical"
                                label="Tên thể loại"
                                name="TenLoaiSP"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                ]}
                            >
                            <Input placeholder="Nhập thể loại..." />
                            </Form.Item>
                        </Col>

                        <Col span={12} md={12} sm={12} xs={24} >
                            <Form.Item
                                label="Icon Thể loại"
                                name="Icon"                            
                            >
                                <Upload
                                        name="file" // Tên trùng với multer
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileImage}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={handleRemoveFile}
                                        onPreview={handlePreview} // Sử dụng onPreview
                                    >
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                </Upload>

                                <Modal
                                    visible={isImagePreviewVisible}
                                    title="Xem Hình Ảnh"
                                    footer={null}
                                    onCancel={() => setIsImagePreviewVisible(false)}
                                >
                                    <img height={550} alt="image" style={{ width: '100%' }} src={imageUrl} />
                                </Modal>
                            </Form.Item>
                        </Col>

                        <Col span={12} md={12} sm={12} xs={24} >
                            <Form.Item
                                label="Hình ảnh hiển thị"
                                name="Image"                            
                            >
                                <Upload
                                        name="file" // Tên trùng với multer
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileImageAnh}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={handleRemoveFile}
                                        onPreview={handlePreviewAnh} // Sử dụng onPreview
                                    >
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                </Upload>    

                                <Modal
                                    visible={isImagePreviewVisibleAnh}
                                    title="Xem Hình Ảnh"
                                    footer={null}
                                    onCancel={() => setIsImagePreviewVisibleAnh(false)}
                                >
                                    <img height={550} alt="image" style={{ width: '100%' }} src={imageUrlAnh} />
                                </Modal>                           
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            
        </Modal>
    )
}
export default Create