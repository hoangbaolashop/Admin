import { Col, Divider, Form, Input, message, Modal, notification, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import { updateTheLoai } from "../../../services/loaiSPAPI";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { uploadImg } from "../../../services/uploadAPI";
import './style.scss'
import { v4 as uuidv4 } from 'uuid';

const Update = (props) => {

    const {
        dataUpdateTheLoai, setDataUpdateTheLoai, fetchListTL, openUpdateTL, setOpenUpdateTL
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);

    const [imageUrl, setImageUrl] = useState('');    
    const [imageUrlAnh, setImageUrlAnh] = useState('');    
    const [loading, setLoading] = useState(false);
    // hiển thị hình ảnh dạng modal khi upload muốn xem lại
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleAnh, setIsModalVisibleAnh] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [fileListAnh, setFileListAnh] = useState([]);

    useEffect(() => {
        if (openUpdateTL && dataUpdateTheLoai?._id) {                   
            // Tạo danh sách file cho Upload
            if (dataUpdateTheLoai.Icon) {    
                setFileList([
                    {
                        uid: uuidv4(),
                        name: dataUpdateTheLoai.Icon, // Tên file
                        status: 'done', // Trạng thái
                        url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${dataUpdateTheLoai.Icon}`, // Đường dẫn đến hình ảnh
                    },
                ]);
            }
            if (dataUpdateTheLoai.Image) {    
                setFileListAnh([
                    {
                        uid: uuidv4(),
                        name: dataUpdateTheLoai.Image, // Tên file
                        status: 'done', // Trạng thái
                        url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${dataUpdateTheLoai.Image}`, // Đường dẫn đến hình ảnh
                    },
                ]);
            }

            const init = {
                _id: dataUpdateTheLoai._id,
                TenLoaiSP: dataUpdateTheLoai.TenLoaiSP,                
                Icon: dataUpdateTheLoai.Icon,                      
                Image: dataUpdateTheLoai.Image,                      
            }
            console.log("init: ", init);
            setImageUrl(dataUpdateTheLoai.Icon)          
            setImageUrlAnh(dataUpdateTheLoai.Image)          
            form.setFieldsValue(init);            
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateTheLoai, openUpdateTL])

    const handleCancel = () => {
        setOpenUpdateTL(false);
        setImageUrl('')
        setImageUrlAnh('')
        setFileList([]);
        setFileListAnh([]);
        form.resetFields()
    };

    const handleUpdateTL = async (values) => {

        const { _id, TenLoaiSP, Icon} = values

        //     console.log("mota: ", mota);
            
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
        // console.log("_id: ", _id);
        
        setIsSubmit(true)
        const res = await updateTheLoai( _id, TenLoaiSP, hinhAnh, hinhAnhAnh)

        if(res){
            message.success(res.message);
            handleCancel()
            setImageUrl('')
            setImageUrlAnh('')
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
                setFileList([ // Đặt lại fileList chỉ chứa file mới
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: res.url, // URL của hình ảnh từ server
                    },
                ]);
                // setDataImage()
                message.success('Upload thành công');
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
                setFileListAnh([ // Đặt lại fileList chỉ chứa file mới
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: res.url, // URL của hình ảnh từ server
                    },
                ]);
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
        setFileList([]); // Reset fileList khi xóa file
        setImageUrl(''); // Reset URL khi xóa file
        message.success(`${file.name} đã được xóa`);
    };
    const handleRemoveFileAnh = (file) => {
        setFileListAnh([]); // Reset fileList khi xóa file
        setImageUrlAnh('')
        message.success(`${file.name} đã được xóa`);
    };

    // mở đóng modal hình ảnh
    const handlePreview = async (file) => {
        setImageUrl(fileList[0].url); // Lấy URL của hình ảnh
        setIsModalVisible(true); // Mở modal
    };
    const handlePreviewAnh = async (file) => {
        setImageUrlAnh(fileListAnh[0].url); // Lấy URL của hình ảnh
        setIsModalVisibleAnh(true); // Mở modal
    };
    console.log("image anh:", imageUrlAnh);
    

    return (
        <Modal
            title="Sửa thông tin thể loại"
            open={openUpdateTL}
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
                    onFinish={handleUpdateTL}
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
                                        name="file"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileImage}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={handleRemoveFile}
                                        fileList={fileList} // Gán danh sách file
                                        onPreview={handlePreview}
                                    >
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>

                                    <Modal
                                        visible={isModalVisible}
                                        footer={null}
                                        title="Xem Hình Ảnh"
                                        onCancel={() => setIsModalVisible(false)}
                                    >
                                        <img alt="Uploaded" style={{ width: '100%' }} src={imageUrl} />
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
                                        onRemove={handleRemoveFileAnh}
                                        fileList={fileListAnh} 
                                        onPreview={handlePreviewAnh} // Sử dụng onPreview
                                    >
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                </Upload>    

                                <Modal
                                    visible={isModalVisibleAnh}
                                    title="Xem Hình Ảnh"
                                    footer={null}
                                    onCancel={() => setIsModalVisibleAnh(false)}
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
export default Update