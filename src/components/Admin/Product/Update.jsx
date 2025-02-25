import { Button, Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from 'antd'
import './style.scss'
import { useEffect, useRef, useState } from 'react'
import {  useSelector } from 'react-redux'
import { TiDeleteOutline } from 'react-icons/ti'
import { MdOutlinePriceCheck } from 'react-icons/md'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { uploadImg } from '../../../services/uploadAPI'
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createProduct, updateProduct } from '../../../services/productAPI'
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS giao diện
const Update = (props) => {

    const {
        openUpdateSP, setOpenUpdateSP, fetchListSP, dataUpdateSP, setDataUpdateSP
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);
    const editorRef = useRef(null);

    const [imageUrl, setImageUrl] = useState([]);  
    const [imageUrls, setImageUrls] = useState([]); // Mảng để lưu trữ các URL của ảnh trong ImageSlider  
    const [loading, setLoading] = useState(false);
    // hiển thị hình ảnh dạng modal khi upload muốn xem lại
    const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);        
    const [previewImage, setPreviewImage] = useState(''); // URL ảnh đang được xem trong modal
    const [fileList, setFileList] = useState([]);
    const [fileLists, setFileLists] = useState([]);


    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);    

    const [limitedPrice, setLimitedPrice] = useState(0);
    const [limitedQuantity, setLimitedQuantity] = useState(0);

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

    // const OPTIONS = ['0', '5', '10', '15', '20', '25', ];
    const OPTIONS = [];
    for (let i = 0; i < 101; i++) {
        OPTIONS.push(i.toString());  // Chuyển số thành chuỗi
    }
    const [selectedItems, setSelectedItems] = useState([]);
    const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));


    const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    const dataHangSX = useSelector(state => state.hangSX.listHangSXs.data)


    useEffect(() => {
        if (openUpdateSP && dataUpdateSP?._id) {                   
            // Ảnh chính 
            let arrThumbnail= [{
                uid: uuidv4(),
                name: dataUpdateSP?.Image, // Tên file
                status: 'done', // Trạng thái
                url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${dataUpdateSP?.Image}`, // Đường dẫn đến hình ảnh
            }]
            console.log("arrThumbnail: ", arrThumbnail);
            setFileList(arrThumbnail);  // Set file list cho ảnh chính
                     

            const arrSlider = dataUpdateSP?.ImageSlider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,  // Tên file
                    status: 'done',  // Trạng thái
                    url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${item}`,  // Đường dẫn ảnh
                };
            });
            console.log("arrSlider: ", arrSlider);
            setFileLists(arrSlider);  // Set file list cho ảnh slider

           
            console.log("fileList: ",fileList);
            console.log("fileLists: ", fileLists);
            

            const init = {
                _id: dataUpdateSP._id,
                TenSP: dataUpdateSP.TenSP,    
                sizes: dataUpdateSP.sizes,    
                MoTaChiTiet: dataUpdateSP.MoTaChiTiet,    
                MoTa: dataUpdateSP.MoTa,    
                urlYoutube: dataUpdateSP.urlYoutube,    
                Image: {fileList: arrThumbnail},  
                ImageSlider: {fileList: arrSlider},    
                GiamGiaSP: `${dataUpdateSP.GiamGiaSP}%`,    
                IdHangSX: dataUpdateSP.IdHangSX._id,  
                IdLoaiSP: dataUpdateSP.IdLoaiSP.map(item => item._id),       
            }
            console.log("init: ", init);
            setImageUrl(arrThumbnail)          
            setImageUrls(arrSlider)          
            form.setFieldsValue(init);                                   
            
            // Lấy các thể loại tương ứng với hãng sản xuất (IdHangSX)
            const selectedBrand = dataHangSX.find(item => item._id === dataUpdateSP.IdHangSX._id);
            
            if (selectedBrand) {
                setAvailableCategories(selectedBrand.IdLoaiSP || []); // Set lại thể loại có sẵn tương ứng với thương hiệu
            } else {
                setAvailableCategories([]); // Nếu không có hãng sản xuất tương ứng, reset thể loại
            }
            // if (editorRef.current) {
            //     editorRef.current.setData(dataUpdateDoctor.MoTa || ''); // Set giá trị cho CKEditor
            //     editorRef.current.setData(dataUpdateDoctor.MoTaChiTiet || ''); // Set giá trị cho CKEditor
            // }
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateSP, openUpdateSP])

    


    const handleCancel = () => {
        setOpenUpdateSP(false);
        setAvailableCategories([]); // Reset categories if no brand is selected
        setSelectedBrand(null);
        setImageUrl('')
        setImageUrls([])
        setPreviewImage([])
        setFileList([])
        setFileLists([])
        form.resetFields()
    };
        
    // Xử lý thay đổi lựa chọn thương hiệu
    const handleBrandChange = (value) => {
        
        const selectedBrand = dataHangSX.find(item => item._id === value);
        console.log('Selected Brand:', selectedBrand);

        if (selectedBrand) {
            setAvailableCategories(selectedBrand.IdLoaiSP);
            setSelectedBrand(value);  // Store the selected brand
            // Xóa giá trị đã chọn của thể loại
            form.setFieldsValue({ IdLoaiSP: [] });
        } else {
            setAvailableCategories([]); // Reset categories if no brand is selected
            setSelectedBrand(null);      // Reset the selected brand
        }
    };

    const handleUpdateSP = async (values) => {
        let {_id, TenSP, IdHangSX, IdLoaiSP, sizes, Image, ImageSlider, MoTa, MoTaChiTiet, GiamGiaSP, urlYoutube} = values
        
        const regex = /(\d+)/;  // Tìm số trong chuỗi
        const result = GiamGiaSP.match(regex);
        const soGiamGia = parseInt(result[0]);
        console.log("_id: ", _id);
        console.log("TenSP: ", TenSP);
        console.log("GiamGiaSP: ", soGiamGia);
        console.log("IdHangSX: ", IdHangSX);
        console.log("IdLoaiSP: ", IdLoaiSP);
        console.log("sizes: ", sizes);        
        console.log("MoTa: ", MoTa);        
        console.log("MoTaChiTiet: ", MoTaChiTiet);        

        const x = fileList?.map(item => item.name) || []
        const hinhAnh = x.join(', ');
        console.log("Image: ", hinhAnh);
        const hinhAnhSlider = fileLists?.map(item => item.name) || []
        console.log("hinhAnhSlider: ", hinhAnhSlider);

        // Kiểm tra nếu chưa upload ảnh chính
        if (!imageUrl || imageUrl.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload hình ảnh chính'
            });
            return;
        }

        // Kiểm tra nếu chưa upload ảnh slider
        if (!imageUrls || imageUrls.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload hình ảnh Slider'
            });
            return;
        }
        
        setIsSubmit(true)
        const res = await updateProduct(_id, TenSP, IdHangSX, IdLoaiSP, sizes, hinhAnh, hinhAnhSlider, MoTa, MoTaChiTiet, soGiamGia, urlYoutube)
        console.log("res sp: ", res);

        if(res && res.data) {
            message.success(res.message)
            handleCancel()
            await fetchListSP()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }        
        setIsSubmit(false)
    }
    
    

    const formatter = (value) => {
        if (!value) return '0';
        return value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        //   .concat(' VNĐ');
    };
    // Hàm parser để loại bỏ dấu phân cách nghìn khi gửi giá trị
    const parser = (value) => {
        if (!value) return '';
        return value.replace(/[^\d]/g, ''); // Loại bỏ các ký tự không phải là số
    };
    // Hàm xử lý thay đổi giá trị
    const handleValueChange = (value) => {
        // Giới hạn giá trị tối đa là 999.999.999
        if (value > 999999999) {
            setLimitedPrice(999999999);  // Đặt giá trị tối đa khi vượt quá giới hạn
        } else {
            setLimitedPrice(value);
        }
    }
    const handleValueChangeQuantity = (value) => {
        // Giới hạn giá trị tối đa là 1000
        if (value > 1000) {
            setLimitedQuantity(1000);  // Đặt giá trị tối đa khi vượt quá giới hạn
        } else {
            setLimitedQuantity(value);
        }
    };

    // Hàm thêm size mới
    const addSize = () => {
        const sizes = form.getFieldValue('sizes');
        form.setFieldsValue({
        sizes: [...sizes, { size: '', quantity: '', price: '' }],
        });
    };

    // Hàm xóa size (nếu cần)
    const removeSize = (index) => {
        const sizes = form.getFieldValue('sizes');
        sizes.splice(index, 1);
        form.setFieldsValue({ sizes });
    };

    
    // upload ảnh chính
    const handleUploadFileImage = async ({ file, onSuccess, onError }) => {

        setLoading(true);
        try {
            const res = await uploadImg(file);
            console.log("res upload: ", res);            
            if (res) {
                // Lấy tên tệp từ URL
                const fileName = res.url.split('/').pop(); // Tách phần cuối của URL để lấy tên tệp
                
                // Tạo một đối tượng mới với tên tệp đã sửa
                const updatedFile = [{
                    uid: file.uid,          // Giữ lại uid
                    name: fileName,         // Cập nhật name với tên tệp mới
                    status: 'done',         // Trạng thái là 'done'
                    url: res.url,           // URL của ảnh
                }];

                setImageUrl(res.url); // URL của hình ảnh từ server     
                onSuccess(file);
                setFileList(updatedFile);
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
    // Hàm upload ảnh slider
    const handleUploadSliderImages = async ({ file, onSuccess, onError }) => {
        setLoading(true);
        try {
            const res = await uploadImg(file);
            console.log("res upload ảnh slider: ", res);
            
            if (res) {
                // Lấy tên tệp từ URL
                const fileName = res.url.split('/').pop(); // Tách phần cuối của URL để lấy tên tệp
                
                // Tạo một đối tượng mới với tên tệp đã sửa
                const updatedFile = {
                    uid: file.uid,          // Giữ lại uid
                    name: fileName,         // Cập nhật name với tên tệp mới
                    status: 'done',         // Trạng thái là 'done'
                    url: res.url,           // URL của ảnh
                };
    
                // Cập nhật fileUrls (nếu cần)
                setImageUrls(prevUrls => [...prevUrls, res.url]);  // Thêm URL vào mảng imageUrls
                onSuccess(file);
    
                // Cập nhật fileList hiện tại, thay vì thay thế hoàn toàn
                setFileLists(prevFileLists => [
                    ...prevFileLists, // Giữ lại các ảnh đã có
                    updatedFile,      // Thêm ảnh mới vào
                ]);
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
    
    
    const handleUploadSliderImages1 = async ({ file, onSuccess, onError }) => {
        setLoading(true);
        try {
            const res = await uploadImg(file);
            console.log("file: ", file);            
            console.log("res upload ảnh slider: ", res);
            if (res) {
                setImageUrls(prevUrls => [...prevUrls, res.url]);  // Thêm URL vào mảng imageUrls
                file.url = res.url;                
                onSuccess(file);
                 // Cập nhật fileList hiện tại, thay vì thay thế hoàn toàn
                setFileLists(prevFileLists => [
                    ...prevFileLists, // Giữ lại các ảnh đã có
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: res.url, // URL của hình ảnh mới
                    },
                ]);
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

    const handlePreview = async (file) => {
        console.log('file object: ', file); 
        if (file.url) {  // Kiểm tra nếu file có URL
            setPreviewImage(file.url);
            setIsImagePreviewVisible(true);
        } else {
            message.error('Không thể hiển thị ảnh. Vui lòng chọn file hợp lệ');
        }
    };
    
    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setImageUrl([])
            setFileList([]);
            message.success(`${file.name} đã được xóa`);
        }
        if (type === 'slider') {
            // Lọc các ảnh trong imageUrls để xóa ảnh có URL tương ứng
            const newSlider = imageUrls.filter(item => item.uid !== file.uid); 
            console.log("newSlider: ", newSlider);
            console.log("file.url: ", file.url);
    
            // Cập nhật lại imageUrls sau khi xóa
            setImageUrls(newSlider);
            
            // Lọc các ảnh trong fileLists để xóa ảnh có UID tương ứng
            const newFileLists = fileLists.filter(item => item.uid !== file.uid);
            console.log("newFileLists: ", newFileLists);
    
            // Cập nhật lại fileLists sau khi xóa
            setFileLists(newFileLists);
    
            message.success(`${file.name} đã được xóa`);
        }
    }     

    console.log("fileList: ", fileList);
    console.log("fileLists: ", fileLists);

    return (
        <Modal
            style={{
                top: 20,
                left: 100
            }}
            title="Sửa sản phẩm"
            centered
            open={openUpdateSP}
            onOk={() => form.submit()}
            onCancel={() => handleCancel()}
            width={930}
            okText={"Xác nhận sửa"}
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
                onFinish={handleUpdateSP}
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
                    <Col span={24}>
                        <Form.Item
                            layout="vertical"
                            hasFeedback                            
                            label="Tên sản phẩm"
                            name="TenSP"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sản phẩm!',
                                },
                            ]}
                        >
                        <Input placeholder="Nhập sản phẩm..." />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item                            
                            layout="vertical"
                            label="Hãng sản phẩm"
                            name="IdHangSX"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn hãng của sản phẩm!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn hãng sản phẩm"
                                style={{
                                    width: '100%',
                                }}       
                                options={dataHangSX?.map(item => ({
                                    value: item._id, 
                                    label: item.TenHangSX, 
                                }))}   
                                filterOption={(input, option) => {
                                    return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                                }}   
                                onChange={handleBrandChange}                        
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                                // options={dataTheLoai.map(item => ({
                                //     value: item._id, // Lưu _id làm giá trị của option
                                //     label: item.TenLoaiSP, // Hiển thị TenLoaiSP là tên thể loại
                                // }))}   
                                options={availableCategories.map(item => ({
                                    value: item._id,
                                    label: item.TenLoaiSP,
                                }))}
                                filterOption={(input, option) => {
                                    return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                                }}          
                            />
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item
                            label="Số % giảm giá"
                            name="GiamGiaSP"
                            layout="vertical"                            
                        >  
                            <Select
                                showSearch
                                placeholder="Vui lòng chọn Số % giảm giá!"
                                value={selectedItems}
                                onChange={setSelectedItems}
                                style={{
                                    width: '100%',
                                }}
                                options={filteredOptions.map((item) => ({
                                    value: `${item}%`,
                                    label: `${item} %`,
                                }))}
                            />
                        </Form.Item> 
                    </Col>
                </Row>
                    <Divider />
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.List
                            name="sizes"
                            initialValue={[]}
                            rules={[
                            {
                                validator: async(_, sizes) => {
                                if (!sizes || sizes.length < 1) {
                                    return Promise.reject(new Error('Hãy thêm ít nhất một size!'));
                                }
                                },
                            },
                            ]}
                        >
                            {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, fieldKey, name, field }, index) => (
                                <Row key={key} gutter={16} style={{ marginBottom: '16px' }}>
                                    <Col span={7}>
                                        <Form.Item
                                            {...field}
                                            name={[name, 'size']}
                                            fieldKey={[fieldKey, 'size']}
                                            label={`Size ${index + 1}`}
                                            rules={[{ required: true, message: 'Vui lòng nhập size!' }]}
                                        >
                                            <Input placeholder="Ví dụ: 128GB" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item
                                            {...field}
                                            name={[name, 'quantity']}
                                            fieldKey={[fieldKey, 'quantity']}
                                            label={`Số lượng ${index + 1}`}
                                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                                        >
                                            {/* <Input placeholder="Số lượng" type="number" /> */}
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder='Nhập Số lượng'
                                                min={0}
                                                max={1000}
                                                formatter={formatter}  // Định dạng hiển thị giá trị
                                                parser={parser}        // Loại bỏ dấu phân cách nghìn khi gửi giá trị
                                                onChange={handleValueChangeQuantity} // Xử lý thay đổi giá trị
                                                value={limitedQuantity}
                                            />   
                                        </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item
                                            {...field}
                                            name={[name, 'price']}
                                            fieldKey={[fieldKey, 'price']}
                                            label={`Đơn giá ${index + 1}`}
                                            rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
                                        >
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                placeholder='Nhập giá bán'
                                                addonAfter={'VNĐ'}
                                                min={0}
                                                max={999999999}
                                                formatter={formatter}  // Định dạng hiển thị giá trị
                                                parser={parser}        // Loại bỏ dấu phân cách nghìn khi gửi giá trị
                                                onChange={handleValueChange} // Xử lý thay đổi giá trị
                                                value={limitedPrice}
                                            />                                            
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <TiDeleteOutline title='Xóa dòng này' size={30} onClick={() => remove(index)} style={{color: "red", cursor: "pointer"}}/>
                                    </Col>
                                    <Divider/>
                                </Row>
                                ))}
                            </>
                            )}
                        </Form.List>
                    </Col>
                    <Col span={24} style={{textAlign: "center"}}>
                        <Button onClick={addSize} icon={<MdOutlinePriceCheck size={20} />}>
                            Thêm dung lượng chi tiết
                        </Button>
                    </Col>                    
                </Row>
                <br/>
                <Row gutter={[20,10]}>
                    <Col span={10}>
                        <Form.Item
                            label="Image chính"
                            name="Image"                            
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
                                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                    onPreview={handlePreview} // Sử dụng onPreview
                                    fileList={fileList || []}  // Gán mảng trống nếu fileList là undefined
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                            </Upload>

                        </Form.Item>
                            <Modal
                                open={isImagePreviewVisible}
                                title="Xem Hình Ảnh"
                                footer={null}
                                onCancel={() => setIsImagePreviewVisible(false)}
                            >
                                <img height={550} alt="image" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                    </Col>
                            
                    <Col span={14}>
                        <Form.Item
                            label="Image Slider"
                            name="ImageSlider"                            
                        >
                            <Upload
                                    name="file" // Tên trùng với multer
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={20}
                                    multiple={true}
                                    customRequest={handleUploadSliderImages}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, "slider")}
                                    onPreview={handlePreview} 
                                    fileList={fileLists || []}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                            </Upload>
                           
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[20,10]}>
                    <Col span={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            hasFeedback
                            layout="vertical"
                            label="Url Youtube"
                            name="urlYoutube"    
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Vui lòng nhập url dạng nhúng theo link youtube!',
                            //     },                                        
                            // ]}                                
                        >
                            <Input placeholder="Nhập url youtube" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            layout="vertical"
                            label="Mô tả"
                            name="MoTa"    
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập 1 chút mô tả!',
                                },                                        
                            ]}                                
                        >
                            <ReactQuill
                                theme="snow"                            
                                modules={modules} // Gắn modules đầy đủ
                                formats={formats} // Gắn các định dạng
                                placeholder="mô tả..."
                                style={{ height: "200px" }} // Tùy chỉnh chiều cao editor
                            />
                            {/* <CKEditor
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
                                    // Other configurations
                                    ckfinder: {
                                        uploadUrl: '/path/to/your/upload/handler', // Đường dẫn đến handler upload
                                    },
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    form.setFieldsValue({ MoTa: data }); // Cập nhật giá trị cho form
                                    console.log({ data }); // Lấy dữ liệu khi có thay đổi
                                }}
                                data={form.getFieldValue('MoTa') || ''} // Thiết lập giá trị từ form
                                onInit={(editor) => {
                                    editorRef.current = editor; // Gán ref khi CKEditor khởi tạo
                                }}
                            /> */}
                        </Form.Item>
                    </Col>
                                                   
                    <Col span={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            layout="vertical"
                            label="Mô tả chi tiết"
                            name="MoTaChiTiet"    
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập 1 chút mô tả!',
                                },                                        
                            ]}                                
                        >
                             <ReactQuill
                                theme="snow"                            
                                modules={modules} // Gắn modules đầy đủ
                                formats={formats} // Gắn các định dạng
                                placeholder="mô tả chi tiết"
                                style={{ height: "200px" }} // Tùy chỉnh chiều cao editor
                            />
                            {/* <CKEditor
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
                                    // Other configurations
                                    ckfinder: {
                                        uploadUrl: '/path/to/your/upload/handler', // Đường dẫn đến handler upload
                                    },
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    form.setFieldsValue({ MoTaChiTiet: data }); // Cập nhật giá trị cho form
                                    console.log({ data }); // Lấy dữ liệu khi có thay đổi
                                }}
                                data={form.getFieldValue('MoTaChiTiet') || ''} // Thiết lập giá trị từ form
                                onInit={(editor) => {
                                    editorRef.current = editor; // Gán ref khi CKEditor khởi tạo
                                }}
                            /> */}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
export default Update