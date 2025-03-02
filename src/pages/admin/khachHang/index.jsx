import { useEffect, useState } from "react"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { fetchAllVoucher } from "../../../services/voucherAPI"
import { deleteAccKH, fetchAllAccKH, khoaAccKH } from "../../../services/accKhAPI"
import { Button, Col, message, notification, Pagination, Popconfirm, Row, Select, Space, Switch, Table, Tag } from "antd"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import Update from "../../../components/Admin/KhachHang/Update"

const KhachHangPage = () => {

    const [loadingTableCheck, setLoadingTableCheck] = useState(false)
    const [loadingTable, setLoadingTable] = useState(false)
    const [dataAccKH, setDataAccKH] = useState([])
    const [dataVoucher, setDataVoucher] = useState([])

    const [openCreateAccKH, setOpenCreateAccKH] = useState(false)
    const [dataUpdateAccKH, setDataUpdateAccKH] = useState(null)
    const [openUpdateAccKH, setOpenUpdateAccKH] = useState(false)

    const [totalAccKH, setTotalAccKH] = useState(0);
    const [currentAccKH, setCurrentAccKH] = useState(1)
    const [pageSizeAccKH, setPageSizeAccKH] = useState(5)
    const [selectedHangTV, setSelectedHangTV] = useState([])

    // dùng để search 
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        fetchListVoucher()
    }, [])

    useEffect(() => {
        fetchListAccKH()
    }, [currentAccKH, pageSizeAccKH, fullName, selectedHangTV])


    const fetchListVoucher = async () => {
        setLoadingTable(true)
        let query = ``                 
        const res = await fetchAllVoucher(query)
        if (res && res.data) {
            setDataVoucher(res.data)
        }
        setLoadingTable(false)
    }

    const fetchListAccKH= async () => {
        setLoadingTable(true)
        let query = `page=${currentAccKH}&limit=${pageSizeAccKH}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (fullName) {
            query += `&fullName=${encodeURIComponent(fullName)}`;
        }   
        if (selectedHangTV) {
            query += `&hangTV=${encodeURIComponent(selectedHangTV)}`;
        }       
    
        const res = await fetchAllAccKH(query)
        if (res && res.data) {
            setDataAccKH(res.data)
            setTotalAccKH(res.totalAccKH); // Lưu tổng số 
        }
        setLoadingTable(false)
    }

    const handleDeleteAccKH = async (id) => {

        const res = await deleteAccKH(id)
        if(res){
            notification.success({
                message: "Khóa tài khoản",
                description: "Bạn đã xoá thành công"
            })
            await fetchListAccKH()
        } else {
            notification.error({
                message: "Xoá",
                description: JSON.stringify(res.message)
            })
        }
    }

    const onChangePagination = (page, pageSize) => {
        setCurrentAccKH(page);
        setPageSizeAccKH(pageSize); // Cập nhật pageSize nếu cần
    };

    const columnsAccKH = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (currentAccKH - 1) * pageSizeAccKH}
                </>
              )
            },
            width: 80
        },        
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text, record) => <div>
                <a>{record.email}</a>
                {!record.otp ?  <p>OTP hết hạn</p> : <p style={{color: "red"}}>OTP: {record.otp}</p>}
                <p>Số lượt quay thưởng: <span style={{color: "red", fontWeight: "500"}}>{record?.quayMayManCount}</span></p>
            </div>,
            width: 180
        }, 
        {
            title: 'Họ Tên và SĐT',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => <div>
                <a>{record?.fullName}</a>  <br/>           
                <a>{record?.phone}</a>                
                </div>,
            width: 150
        }, 
        {
            title: 'Tổng doanh thu & Hạng thành viên',
            dataIndex: 'doanhThukh',
            key: 'doanhThukh',
            render: (text, record) => <div>
                <strong>Tổng đơn hàng: </strong> <span>{record?.soLuongDonThanhCong}</span> đơn hàng <br/>
                <strong>Tổng doanh thu: </strong> <span style={{color: "red"}}>{record?.tongDoanhThuThanhCong}</span> <br/>
                <strong>Hạng thành viên: </strong> <span style={{color: "green"}}>{record?.hangTV || 'Bạc'}</span>
            </div>,
        },        
        {
            title: 'Mã Giảm Giá',
            dataIndex: 'IdVoucher',
            key: 'IdVoucher',
            render: (text) => (
                Array.isArray(text) && text.length === 0 ? (
                    <p>Chưa có mã giảm giá</p>
                ) : (
                    <ul>
                        {Array.isArray(text) ? text.map(item => (
                            <li key={item._id}> &nbsp;
                                <span style={{ color: 'navy' }}>{item.code}</span> - Đơn hàng trên &nbsp;
                                <span style={{ color: 'red' }}>
                                    {Number(item.dieuKien).toLocaleString()}đ
                                </span>
                                {' '} - <span style={{ color: 'navy' }}>{item.giamGia}%</span> <br/> <span>Ngày hết hạn: <span style={{ color: 'green' }}>{item.thoiGianHetHan}</span></span>
                            </li>
                        )) : <p>Chưa có mã giảm giá</p>}
                    </ul>
                )
            ),
        }, 
        // {
        //     title: 'Mã OTP',
        //     dataIndex: 'otp',
        //     key: 'otp',
        //     render: (text, record) => (
        //         <a>
        //             {record?.otp}
        //         </a>
        //     ),
        //     // width: 100
        // }, 
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'isActive',
        //     key: 'isActive',
        //     render: (text, record) => (
        //         <a>
        //             {text ? <Tag color="success">Đang hoạt động</Tag> : <Tag color="error">Đang bị khóa</Tag>}
        //         </a>                
        //     ),
        //     // width: 150
        // },          
        {
          title: 'Chức năng',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                <EditOutlined style={{color: "orange", fontSize: "20px"}} onClick={() => {
                    console.log("record update: ", record);
                    setOpenUpdateAccKH(true)
                    setDataUpdateAccKH(record)
                }} /> 

                <Popconfirm
                    title={`Xóa tài khoản`}
                    description="Bạn có chắc chắn muốn Xóa?"
                    onConfirm={() => handleDeleteAccKH(record._id)}
                    onCancel={() => message.error('hủy xóa')}
                    okText="Xác nhận xoá"
                    cancelText="Không Xoá"
                >
                    <DeleteOutlined style={{color: "red", fontSize: "20px"}} />
                </Popconfirm>
                
                <Switch 
                    loading={loadingTableCheck}
                    checked={record.isActive}  // Giả sử là `isActive` trong dữ liệu tài khoản
                    onChange={(checked) => onChange(checked, record)} 
                    checkedChildren="ON"
                    unCheckedChildren="BANS"
                />
            </Space>
          ),
        //   width: 200
        },
    ];   

    const onChange = async (checked, record) => {
        const updatedStatus = checked ? true : false; // true nếu bật (mở tài khoản), false nếu tắt (khóa tài khoản)
        
        try {
            setLoadingTableCheck(true)
            // Gửi yêu cầu cập nhật trạng thái tài khoản đến server (ví dụ, sử dụng fetch hoặc axios)
            // const response = await axios.put(`/api/account/${record._id}`, { isActive: updatedStatus });
            const response = await khoaAccKH(record._id, updatedStatus)
    
            if (response.data) {
                // Cập nhật trạng thái thành công, bạn cần cập nhật lại state của `isActive`
                // Ví dụ: cập nhật trạng thái trong data table của bạn
                setDataAccKH(prevData => {
                    return prevData.map(acc => 
                        acc._id === record._id ? { ...acc, isActive: updatedStatus } : acc
                    );
                });
    
                message.success("Cập nhật trạng thái thành công!");
            }
            setLoadingTableCheck(false)
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            message.error("Cập nhật trạng thái thất bại!");
        }
    };

    const onChangeTheoLoaiTV = (value) => {
        setSelectedHangTV(value)
    }
    return (
        <div className="row mt-4">
            <NavbarTop 
            title={'Users'} 
            placeholder={'Search Users...'} 
            searchTheoName={setFullName} />

            <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
                <div className="card z-index-2 h-100">
                <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                    <h6>Danh sách tài khoản khách hàng</h6>
                    <Select
                        showSearch
                        placeholder="Lọc theo hạng thành viên"
                        value={selectedHangTV}
                        onChange={(e) => onChangeTheoLoaiTV(e)}
                        style={{
                            width: '300px',
                        }}
                        options={[
                            { label: 'Bạc', value: 'Bạc' },                                                     
                            { label: 'Vàng', value: 'Vàng' },                                                     
                            { label: 'Bạch Kim', value: 'Bạch Kim' },                                                     
                            { label: 'Kim Cương', value: 'Kim Cương' },                                                     
                        ]}
                        filterOption={(input, option) => {
                            return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                        }}  
                    /> 
                </div>
                <div className="card-body p-3">
                    <div className="chart">
                    {/* <canvas id="chart-line" className="chart-canvas" height={300} /> */}
                        <Row>
                            <Col span={24}>
                                <Table 
                                pagination={false}
                                loading={loadingTable}
                                columns={columnsAccKH} 
                                dataSource={dataAccKH} />
                            </Col>
                        </Row>

                        <Pagination 
                            style={{
                                fontSize: "17px",
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px 0 20px 0"
                            }}
                            current={currentAccKH}
                            pageSize={pageSizeAccKH}
                            total={totalAccKH}
                            onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            showTotal={(total, range) => (
                                <div>{range[0]}-{range[1]} trên {total} tài khoản</div>
                            )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        />
                                                
                        <Update
                        fetchListAccKH={fetchListAccKH}
                        dataUpdateAccKH={dataUpdateAccKH}
                        setDataUpdateAccKH={setDataUpdateAccKH}
                        openUpdateAccKH={openUpdateAccKH}
                        setOpenUpdateAccKH={setOpenUpdateAccKH}
                        /> 
                    </div>
                </div>
                </div>
            </div>                                                          
        </div>
    )
}
export default KhachHangPage