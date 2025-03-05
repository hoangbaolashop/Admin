import { Col, message, Pagination, Popconfirm, Row, Space, Switch, Table, Tag } from "antd"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { useEffect, useState } from "react"
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined, HourglassOutlined } from "@ant-design/icons"
import { deleteAOrderHistory, fetchAllOrderHistory } from "../../../services/historyOrderAPI"
import moment from 'moment-timezone';
import DrawerOrder from "../../../components/Admin/Drawer/DrawerOrder"
import ModalUpdate from "../../../components/Admin/Order/ModalUpdate"

const HistoryCart = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [dataDH, setDataDH] = useState([])
    const [sortQuery, setSortQuery] = useState("sort=createdAt");

    const [totalDH, setTotalDH] = useState(0);
    const [currentDH, setCurrentDH] = useState(1)
    const [pageSizeDH, setPageSizeDH] = useState(5)

    const [openViewDetailOrder, setOpenViewDetailOrder] = useState(false)
    const [dataDetailOrder, setDataDetailOrder] = useState(null)
    const [openUpdateOrder, setOpenUpdateOrder] = useState(false)
    const [dataUpdateOrder, setDataUpdateOrder] = useState(null)

    // dùng để search 
    const [tenKH, setTenKH] = useState('');
    console.log("dataDH: ", dataDH);
    
    useEffect(() => {
        findAllHistoryOrder()
    }, [currentDH, pageSizeDH, tenKH, sortQuery])

    const findAllHistoryOrder = async () => {
        let query = `page=${currentDH}&limit=${pageSizeDH}`
        if (tenKH) {
            query += `&tenKH=${encodeURIComponent(tenKH)}`;
        }  
        if (sortQuery) {
            query += `&${sortQuery}`;
        } 

        setLoadingTable(true)
        let res = await fetchAllOrderHistory(query)
        if (res && res.data) {
            setDataDH(res.data.findOrder)
            setTotalDH(res.data.totalDH); // Lưu tổng số 
        }
        setLoadingTable(false)
    }
    
    // sử dụng khi dùng phân trang tại table antd -- và dùng cả sắp xếp khi click vào cột trong table
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('Pagination Change:', { pagination, filters, sorter, extra });
        
        // Handle sorting if any
        if (sorter && sorter.field) {
            const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // Determine sort order
            const newSortQuery = `sort=${sorter.field}&order=${sortOrder}`;
            if (newSortQuery !== sortQuery) {
                setSortQuery(newSortQuery); // Only update if sort query changes
            }
        }

    };

    const onChangePagination = (page, pageSize, sorter = null) => {
        setCurrentDH(page);
        setPageSizeDH(pageSize); // Cập nhật pageSize nếu cần

        console.log("sorter: ", sorter);
        
        // Handle sorting if any
        if (sorter && sorter.field) {
            const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // Determine sort order
            const newSortQuery = `sort=${sorter.field}&order=${sortOrder}`;
            if (newSortQuery !== sortQuery) {
                setSortQuery(newSortQuery); // Only update if sort query changes
            }
        }
    };  
    
    const handleDeleteDH = async (id) => {

        let res = await deleteAOrderHistory(id)
        if (res && res.data) {
            message.success(res.message)
            await findAllHistoryOrder()
        }
    }

    const columnsDH = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (currentDH - 1) * pageSizeDH}
                </>
              )
            },
            width: "20px"
        },       
        {
            title: 'Mã đơn',
            dataIndex: 'madon',
            key: 'madon',
            render: (text, record) => <>
                <p style={{fontWeight: "500"}}>#{record._id.slice(-6)}</p>
            </>,
            width: "20px"
        },  
        {
            title: 'Tên khách hàng',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text, record) => <>
                <a>{record.lastName} {record.firstName}</a>
                <p>Email: {record.email}</p>
                <p>Số điện thoại: {record.phone}</p>
                <p>Địa chỉ: {record.address}</p>
            </>,
            width: "250px"
        },                
        {
            title: <span style={{justifyContent: "center", display: "flex"}}>Trạng thái</span>,
            key: 'status',
            width: 50,
            dataIndex: 'status',
            render: (text, record) => {            
                // Hàm lấy màu và icon cho TinhTrangDonHang
                const getStatusTagForTinhTrangDonHang = (status) => {
                    if (status === "Chưa giao hàng") {
                        return { color: 'red', icon: <ExclamationCircleOutlined /> };
                    }
                    if (status === "Đang giao hàng") {
                        return { color: 'orange', icon: <HourglassOutlined /> };
                    }
                    return { color: 'blue', icon: <CheckCircleOutlined /> }; // "Đã giao hàng"
                };
            
                // Hàm lấy màu và icon cho TinhTrangThanhToan
                const getStatusTagForTinhTrangThanhToan = (status) => {
                    return status === "Chưa Thanh Toán"
                    ? { color: 'red', icon: <ExclamationCircleOutlined /> }
                    : { color: 'green', icon: <CheckCircleOutlined /> }; // "Đã Thanh Toán"
                };
            
                const donHangTag = getStatusTagForTinhTrangDonHang(record.TinhTrangDonHang);
                const thanhToanTag = getStatusTagForTinhTrangThanhToan(record.TinhTrangThanhToan);
                return (
                    <div style={{justifyContent: "center", display: "flex"}}>      
                        {record?.TrangThaiHuyDon === 'Không Hủy' ? (
                            record?.TinhTrangDonHang === 'Đã giao hàng' && record?.TinhTrangThanhToan === 'Đã Thanh Toán' ? 
                                <Tag color='green' icon={<CheckCircleOutlined />}>Đơn hàng giao thành công</Tag> : 
                                (record?.TinhTrangDonHang === 'Đã giao hàng' && record?.TinhTrangThanhToan === 'Chưa Thanh Toán' ? 
                                    <Tag color='red' icon={<ExclamationCircleOutlined />}>Lỗi đơn hàng</Tag> :                                    
                                        <Row gutter={[20,10]} style={{textAlign: "center"}}>
                                            <Col span={24}>
                                                <Tag color={donHangTag.color} icon={donHangTag.icon}>{record.TinhTrangDonHang}</Tag>
                                            </Col>
                                            <Col span={24}>
                                                <Tag color={thanhToanTag.color} icon={thanhToanTag.icon}>{record.TinhTrangThanhToan}</Tag>
                                            </Col>
                                        </Row>                                                                      
                                )                       
                        ) : (
                            record?.TinhTrangThanhToan === 'Chờ hoàn tiền' ? 
                            <>
                            <Row gutter={[20,10]} style={{textAlign: "center"}}>
                                <Col span={24}>
                                    <Tag color='default' icon={<CheckCircleOutlined />}>{record?.TrangThaiHuyDon}</Tag>
                                </Col>
                                <Col span={24}>
                                    <Tag color={'warning'} icon={<ExclamationCircleOutlined />}>{record.TinhTrangThanhToan}</Tag>
                                </Col>
                            </Row>                                
                            </>  :  <Tag color='default' icon={<CheckCircleOutlined />}>{record?.TrangThaiHuyDon}</Tag>
                        ) }                    
                    </div>
                );
            },
        },   
        {
            title: <span style={{justifyContent: "center", display: "flex"}}>Thông tin</span>,
            width: "200px",
            dataIndex: 'tt',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign: "center"}}>
                        <p>Tổng số sản phẩm: <span style={{color: "navy"}}>{record.tongSoLuong}</span></p>
                        <p>Tổng tiền: <span style={{color: "navy"}}>{Math.round(record.thanhTien).toLocaleString()}đ</span></p>
                        <p>Giảm giá: <span style={{color: "red"}}>{Math.round(record.soTienGiamGia).toLocaleString()}đ</span></p>
                        <p>Cần thanh toán: <span style={{color: "red"}}>{Math.round(record.soTienCanThanhToan).toLocaleString()}đ</span></p>
                        <p>Ghi chú: <span style={{color: "red"}}>{record?.note}</span></p>
                    </div>
                )
            }
        },  
        {
            title: 'Ngày đặt đơn',
            width: "110px",
            sorter: true,
            dataIndex: 'createdAt',
            render: (text, record, index) => {
                return (
                    <div style={{textAlign: "center"}}>
                    {moment(record?.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY')} <br/>
                    {moment(record?.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')}                   
                    </div>
                )
            }
        }, 
        {
            title: 'Chức năng',
            key: 'action',
            render: (_, record) => {
                let editButton = null;
            
                // Kiểm tra điều kiện để hiển thị nút Edit
                if (
                    record.TrangThaiHuyDon.toLowerCase() === 'không hủy' && 
                    (record.TinhTrangDonHang.toLowerCase() === 'đang giao hàng' || 
                    record.TinhTrangDonHang.toLowerCase() === 'chưa giao hàng') && 
                    record.TinhTrangThanhToan.toLowerCase() !== 'đã thanh toán'
                ) {
                    editButton = (
                    <EditOutlined 
                        style={{color: "orange", fontSize: "20px"}} 
                        onClick={() => {
                        console.log("record update: ", record);
                        setOpenUpdateOrder(true);
                        setDataUpdateOrder(record);
                        }} 
                    />
                    );
                }
            
                // Điều kiện để nút Edit hiển thị khi đơn hàng "Chưa giao hàng" và "Đã thanh toán"
                if (
                    record.TrangThaiHuyDon.toLowerCase() === 'không hủy' && 
                    record.TinhTrangDonHang.toLowerCase() === 'chưa giao hàng' && 
                    record.TinhTrangThanhToan.toLowerCase() === 'đã thanh toán'
                ) {
                    editButton = (
                    <EditOutlined 
                        style={{color: "orange", fontSize: "20px"}} 
                        onClick={() => {
                        console.log("record update: ", record);
                        setOpenUpdateOrder(true);
                        setDataUpdateOrder(record);
                        }} 
                    />
                    );
                }

                if (
                    record.TrangThaiHuyDon.toLowerCase() === 'không hủy' && 
                    record.TinhTrangDonHang.toLowerCase() === 'đang giao hàng' && 
                    record.TinhTrangThanhToan.toLowerCase() === 'đã thanh toán'
                ) {
                    editButton = (
                    <EditOutlined 
                        style={{color: "orange", fontSize: "20px"}} 
                        onClick={() => {
                        console.log("record update: ", record);
                        setOpenUpdateOrder(true);
                        setDataUpdateOrder(record);
                        }} 
                    />
                    );
                }

                if (
                    record.TrangThaiHuyDon.toLowerCase() === 'không hủy' && 
                    record.TinhTrangDonHang.toLowerCase() === 'đã giao hàng' && 
                    record.TinhTrangThanhToan.toLowerCase() === 'chưa thanh toán'
                ) {
                    editButton = (
                    <EditOutlined 
                        style={{color: "orange", fontSize: "20px"}} 
                        onClick={() => {
                        console.log("record update: ", record);
                        setOpenUpdateOrder(true);
                        setDataUpdateOrder(record);
                        }} 
                    />
                    );
                }

                if (
                    record.TrangThaiHuyDon.toLowerCase() === 'đã hủy' && 
                    record.TinhTrangThanhToan.toLowerCase() === 'chờ hoàn tiền'
                ) {
                    editButton = (
                    <EditOutlined 
                        style={{color: "orange", fontSize: "20px"}} 
                        onClick={() => {
                        console.log("record update: ", record);
                        setOpenUpdateOrder(true);
                        setDataUpdateOrder(record);
                        }} 
                    />
                    );
                }
          
                return (
                    <Space size="middle">
                    <EyeOutlined 
                        style={{color: "green", fontWeight: "bold", cursor: "pointer", fontSize: "18px"}} 
                        onClick={() => {
                        console.log("record: ", record);    
                        setOpenViewDetailOrder(true)    
                        setDataDetailOrder(record)                             
                        }} 
                    />
                    
                    {editButton} {/* Chỉ hiển thị nút Edit nếu điều kiện thỏa mãn */}
            
                    <Popconfirm
                        title={`Xóa đơn hàng này`}
                        description="Bạn có chắc chắn muốn Xóa?"
                        onConfirm={() => handleDeleteDH(record._id)}
                        onCancel={() => message.error('hủy xóa')}
                        okText="Xác nhận xoá"
                        cancelText="Không Xoá"
                    >
                        <DeleteOutlined style={{color: "red", fontSize: "20px"}} />
                    </Popconfirm>
                    </Space>
                );
            },
            width: 100
        },                
        // {
        //   title: 'Chức năng',
        //   key: 'action',
        //   render: (_, record) => (
        //     <Space size="middle">
        //         <EyeOutlined style={{color: "green", fontWeight: "bold", cursor: "pointer", fontSize: "18px"}} 
        //             onClick={() => {
        //                 console.log("record: ", record);    
        //                 setOpenViewDetailOrder(true)    
        //                 setDataDetailOrder(record)                             
        //             }} 
        //         />

        //         {/* {record.TrangThaiHuyDon.toLowerCase() === 'Không Hủy' && !(record.TinhTrangDonHang.toLowerCase() === 'Đã giao hàng' && record.TinhTrangThanhToan.toLowerCase() === 'Đã Thanh Toán') ? (
        //             <>
        //                 <EditOutlined 
        //                     style={{color: "orange", fontSize: "20px"}} 
        //                     onClick={() => {
        //                         console.log("record update: ", record);
        //                         setOpenUpdateOrder(true)
        //                         setDataUpdateOrder(record)
        //                     }} 
        //                 />
        //             </>
        //         ) : null}    */}
        //         {record.TrangThaiHuyDon.toLowerCase() === 'Không Hủy' && 
        //         (record.TinhTrangDonHang.toLowerCase() === 'Đang giao hàng' || record.TinhTrangDonHang.toLowerCase() === 'Chưa giao hàng') && 
        //         record.TinhTrangThanhToan.toLowerCase() !== 'Đã Thanh Toán' ? (
        //             <>
        //                 <EditOutlined 
        //                     style={{color: "orange", fontSize: "20px"}} 
        //                     onClick={() => {
        //                         console.log("record update: ", record);
        //                         setOpenUpdateOrder(true);
        //                         setDataUpdateOrder(record);
        //                     }} 
        //                 />
        //             </>
        //         ) : null}        

        //         <Popconfirm
        //             title={`Xóa đơn hàng này`}
        //             description="Bạn có chắc chắn muốn Xóa?"
        //             onConfirm={() => handleDeleteDH(record._id)}
        //             onCancel={() => message.error('hủy xóa')}
        //             okText="Xác nhận xoá"
        //             cancelText="Không Xoá"
        //         >
        //             <DeleteOutlined style={{color: "red", fontSize: "20px"}} />
        //         </Popconfirm>                
        //     </Space>
        //   ),
        //   width: 100
        // },
    ];  

    return (
        <div className="row mt-4">
            <NavbarTop 
            title={'Order'} 
            placeholder={'Search đơn hàng...'} 
            searchTheoName={setTenKH} 
            />

            <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
                <div className="card z-index-2 h-100">
                <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                    <h6>Danh sách đơn hàng</h6>
                    <h5></h5>
                </div>
                <div className="card-body p-3">
                    <div className="chart">
                    {/* <canvas id="chart-line" className="chart-canvas" height={300} /> */}
                        <Row>
                            <Col span={24}>
                                <Table 
                                pagination={false}
                                loading={loadingTable}
                                columns={columnsDH} 
                                onChange={onChange}
                                dataSource={dataDH} />
                            </Col>
                        </Row>

                        <Pagination 
                            style={{
                                fontSize: "17px",
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px 0 20px 0"
                            }}
                            current={currentDH}
                            pageSize={pageSizeDH}
                            total={totalDH}
                            onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            showTotal={(total, range) => (
                                <div>{range[0]}-{range[1]} trên {total} đơn hàng</div>
                            )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        />      

                        <DrawerOrder
                        openViewDetailOrder={openViewDetailOrder}
                        setOpenViewDetailOrder={setOpenViewDetailOrder}
                        dataDetailOrder={dataDetailOrder}
                        setDataDetailOrder={setDataDetailOrder}
                        />          

                        <ModalUpdate
                        findAllHistoryOrder={findAllHistoryOrder}
                        openUpdateOrder={openUpdateOrder}
                        setOpenUpdateOrder={setOpenUpdateOrder}
                        dataUpdateOrder={dataUpdateOrder}
                        setDataUpdateOrder={setDataUpdateOrder}
                        />                                                        
                    </div>
                </div>
                </div>
            </div>                                                          
        </div>
    )
}
export default HistoryCart