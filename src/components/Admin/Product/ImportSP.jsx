import { Modal, Table, notification } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import * as XLSX from 'xlsx';
import { useState } from "react";
import templateFile from './demoFormat.xlsx?url'
import { importProducts } from "../../../services/productAPI";
import { uploadExcel } from "../../../services/uploadAPI";

const { Dragger } = Upload;
const ImportSP = (props) => {
    const { setOpenModalImport, openModalImport, fetchListSP } = props;
    const [dataExcel, setDataExcel] = useState([])
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState('')

    // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv

        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            // if (status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }
            // if (status === 'done') {
            //     if (info.fileList && info.fileList.length > 0) {
            //         const file = info.fileList[0].originFileObj;
            //         const reader = new FileReader();
            //         reader.readAsArrayBuffer(file);
            //         reader.onload = function (e) {
            //             const data = new Uint8Array(reader.result);
            //             const workbook = XLSX.read(data, { type: 'array' });
            //             const sheet = workbook.Sheets[workbook.SheetNames[0]];
            //             // const json = XLSX.utils.sheet_to_json(sheet);
            //             // Chuyển dữ liệu từ sheet thành JSON
            //             const json = XLSX.utils.sheet_to_json(sheet, {
            //                 header: ["TenSP", "GiamGiaSP", "MoTa", "MoTaChiTiet", "size", "quantity", "price", "IdLoaiSP", "IdHangSX"],
            //                 range: 1 //skip header row
            //             });
            //             if (json && json.length > 0) {
            //                 setDataExcel(json);
            //             } else {
            //                 message.error("Dữ liệu trong file Excel không hợp lệ hoặc trống.");
            //             }
            //         }
            //     }
            //     message.success(`${info.file.name} file uploaded successfully.`);
            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            // }
            if (status === 'done') {
                // Gọi hàm xử lý file upload khi file đã được chọn
                console.log("info: ",info);
                
                handleFileUpload(info.file.originFileObj);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    // Hàm gọi API uploadExcel để gửi file lên backend
    const handleFileUpload = async (file) => {
        try {
            const response = await uploadExcel(file);  // Gọi hàm uploadExcel trong service
            console.log("res handleFileUpload: ", response);
            console.log("file handleFileUpload: ", file);
            
            if (response.data && response.success) {
                message.success(`${file.name} file uploaded successfully. okok`);

                // Sau khi upload thành công, đọc file Excel và hiển thị dữ liệu lên table
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function (e) {
                    const data = new Uint8Array(reader.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const json = XLSX.utils.sheet_to_json(sheet, {
                        header: ["TenSP", "GiamGiaSP", "MoTa", "MoTaChiTiet", "size", "quantity", "price", "IdLoaiSP", "IdHangSX"],
                        range: 1 //skip header row
                    });
                    if (json && json.length > 0) {
                        setDataExcel(json);
                    } else {
                        message.error("Dữ liệu trong file Excel không hợp lệ hoặc trống.");
                    }
                };
            }

            // Truyền tên gốc file tới backend để xử lý
            const fileName = file.name; // Lấy tên gốc của file
            setFileName(fileName)
        } catch (error) {
            message.error("File upload failed. Please try again.");
        }
    };

    const handleSubmit = async () => {
        if (dataExcel.length === 0) {
            notification.error({
                description: "Vui lòng tải lên một file Excel trước khi import!",
                message: "Không có dữ liệu để import",
            });
            return; // Dừng lại nếu không có dữ liệu
        }
        
        // // Kiểm tra dữ liệu trước khi gửi
        // const isValidData = dataExcel.every(item => {
        //     return item.TenSP && item.GiamGiaSP && item.MoTa && item.MoTaChiTiet && item.size && item.quantity && item.price && item.IdLoaiSP && item.IdHangSX;
        // });

        // if (!isValidData) {
        //     notification.error({
        //         description: "Dữ liệu trong file Excel không đầy đủ hoặc không hợp lệ.",
        //         message: "Dữ liệu không hợp lệ",
        //     });
        //     return;
        // }

        // Tiến hành gửi dữ liệu
        const data = dataExcel.map(item => {
            item.MoTa = item.MoTa || 'Chưa có mô tả'; // Đảm bảo trường mô tả không trống
            return item;
        });

        // Bạn lấy tên gốc của file từ nơi nào đó
        console.log("fileName: ", fileName);
        setLoading(true)
        const res = await importProducts(data, fileName);
        if (res.data) {
            notification.success({
                description: `Thành Công`,
                message: "Upload thành công",
            })
            setDataExcel([]);
            setOpenModalImport(false);
            await fetchListSP();
        } else {
            notification.error({
                description: res.message,
                message: "Đã có lỗi xảy ra",
            })
        }
        setLoading(false)
    }


    return (
        <>
            <Modal title="Import data product"
                width={"70vw"}
                loading={loading}
                style={{marginLeft: "350px"}}
                open={openModalImport}
                onOk={() => handleSubmit()}
                onCancel={() => {
                    setOpenModalImport(false)
                    setDataExcel([]); // Reset table data
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: false
                }}
                //do not close when click outside
                maskClosable={false}
            >
                <Dragger {...propsUpload} showUploadList={dataExcel.length > 0}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                    <p className="ant-upload-hint">
                        Hỗ trợ cho một lần tải lên. Chỉ chấp nhận .csv, .xls, .xlsx hoặc
                        &nbsp;  <a onClick={e => e.stopPropagation()} href={templateFile} download>Tải xuống tệp mẫu</a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        dataSource={dataExcel}
                        title={() => <span style={{fontSize: "18px", color: "navy"}}>Dữ liệu upload:</span>}
                        columns={[
                            { dataIndex: 'TenSP', title: 'Tên sản phẩm' },
                            { dataIndex: 'GiamGiaSP', title: 'Giảm giá ' },
                            { dataIndex: 'MoTa', title: 'Mô tả' },
                            { dataIndex: 'MoTaChiTiet', title: 'Mô tả chi tiết' },
                            { dataIndex: 'size', title: 'Cấu hình' },
                            { dataIndex: 'quantity', title: 'Tồn kho' },
                            { dataIndex: 'price', title: 'Đơn giá' },
                            { dataIndex: 'IdLoaiSP', title: 'Loại sản phẩm' },
                            { dataIndex: 'IdHangSX', title: 'Hãng sản phẩm' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ImportSP;