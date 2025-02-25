import { Avatar, Button, Col, message, notification, Pagination, Popconfirm, Row, Space, Table, Tag } from "antd"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { useEffect, useState } from "react"
import { IoMdAdd } from "react-icons/io";
import Create from "../../../components/Admin/Category/Create";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { deleteTheLoai, fetchAllTheLoai } from "../../../services/loaiSPAPI";
import Update from "../../../components/Admin/Category/Update";
import moment from "moment/moment";

const Category = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [dataTheLoai, setDataTheLoai] = useState([])
    const [openCreateTL, setOpenCreateTL] = useState(false)
    const [dataUpdateTheLoai, setDataUpdateTheLoai] = useState(null)
    const [openUpdateTL, setOpenUpdateTL] = useState(false)
    const [totalTheLoai, setTotalTheLoai] = useState(0);
    const [currentTL, setCurrentTL] = useState(1)
    const [pageSizeTL, setPageSizeTL] = useState(5)
    const [sortQuery, setSortQuery] = useState("sort=createdAt");
     // dùng để search 
     const [tenTL, setTenTL] = useState('');

    useEffect(() => {
        fetchListTL()
    }, [currentTL, pageSizeTL, tenTL, sortQuery])

    const fetchListTL = async (id) => {
        setLoadingTable(true)
        let query = `page=${currentTL}&limit=${pageSizeTL}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (tenTL) {
            query += `&TenLoaiSP=${encodeURIComponent(tenTL)}`;
        }  
        if (sortQuery) {
            query += `&${sortQuery}`;
        }      
    
        const res = await fetchAllTheLoai(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataTheLoai(res.data)
            setTotalTheLoai(res.totalLoaiSP); // Lưu tổng số 
        }
        setLoadingTable(false)
    }

    const handleDeleteTL = async (id) => {

        const res = await deleteTheLoai(id)
        if(res){
            notification.success({
                message: "Xóa thông tin thể loại",
                description: "Bạn đã xoá thành công"
            })
            await fetchListTL()
        } else {
            notification.error({
                message: "Xoá",
                description: JSON.stringify(res.message)
            })
        }
    }
    
    const onChangePagination = (page, pageSize, sorter = null) => {
        setCurrentTL(page);
        setPageSizeTL(pageSize); // Cập nhật pageSize nếu cần

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

    const columnsTheLoai = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (currentTL - 1) * pageSizeTL}
                </>
              )
            },
            width: 100
        },
        {
            title: 'Icon',
            dataIndex: 'Icon',            
            key: 'Icon',
            render: (text) => {
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${text}`;
                return <Avatar style={{border: "1px solid navy", backgroundColor: "whitesmoke"}} src={imageUrl} shape="square" size={64} icon={<UserOutlined />} />

                //  <img src={imageUrl} alt="icon" style={{ width: 50, height: 50 }} />
            },
            width: 100
        },
        {
            title: 'Image',
            dataIndex: 'Image',            
            key: 'Image',
            render: (text) => {
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${text}`;
                return <Avatar style={{border: "1px solid navy", backgroundColor: "whitesmoke"}} src={imageUrl} shape="square" size={64} icon={<UserOutlined />} />

                //  <img src={imageUrl} alt="icon" style={{ width: 50, height: 50 }} />
            },
            width: 100
        },
        {
            title: 'Tên thể loại',
            dataIndex: 'TenLoaiSP',
            key: 'TenLoaiSP',
            sorter: true,
            render: (text) => <a>{text}</a>,
        },  
        {
            title: 'Tổng số sản phẩm',
            dataIndex: 'totalProducts',
            key: 'totalProducts',
            sorter: true,
            render: (text) => <a>{text}</a>,
            width: 180
        },
        {
            title: 'Ngày thêm',
            width: "150px",
            dataIndex: 'createdAt',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{moment(record.createdAt).format('DD-MM-YYYY hh:mm:ss')}</>
                )
            }
        },  
        {
            title: 'Ngày cập nhật',
            width: "150px",
            dataIndex: 'updatedAt',
            render: (text, record, index) => {
                return (
                    <>{moment(record.updatedAt).format('DD-MM-YYYY hh:mm:ss')}</>
                )
            }
        },       
        {
          title: 'Chức năng',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                <EditOutlined style={{color: "orange", fontSize: "20px"}} onClick={() => {
                    console.log("record update: ", record);
                    setOpenUpdateTL(true)
                    setDataUpdateTheLoai(record)
                }} /> 

                <Popconfirm
                    title={`xóa thể loại`}
                    description="Bạn có chắc chắn muốn xoá?"
                    // onConfirm={() => handleDeleteTL(record._id)}
                    onConfirm={() => notification.warning({
                        message: "KHÔNG THỂ XÓA",
                        description: 'Nếu xóa, sản phẩm sẽ bị vô gia cư đó thưa ngài!!!!'
                    })}
                    onCancel={() => message.error('hủy xóa')}
                    okText="Xác nhận xoá"
                    cancelText="Không Xoá"
                >
                    <DeleteOutlined style={{color: "red", fontSize: "20px"}} />
                </Popconfirm>
            </Space>
          ),
          width: 200
        },
    ];    
    
    

    return (
        <div className="row mt-4">
            <NavbarTop 
            title={'Category'} 
            placeholder={'Search Category...'} 
            searchTheoName={setTenTL} />

            <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
                <div className="card z-index-2 h-100">
                <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                    <h6>Category List</h6>
                    <Button size='large' type="primary" icon={<IoMdAdd size={22} />} onClick={() => setOpenCreateTL(true)}>Create Category</Button>
                </div>
                <div className="card-body p-3">
                    <div className="chart">
                    {/* <canvas id="chart-line" className="chart-canvas" height={300} /> */}
                        <Row>
                            <Col span={24}>
                                <Table 
                                rowKey={"_id"} 
                                onChange={onChange}
                                pagination={false}
                                loading={loadingTable}
                                columns={columnsTheLoai} 
                                dataSource={dataTheLoai} />
                            </Col>
                        </Row>

                        <Pagination 
                            style={{
                                fontSize: "17px",
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px 0 20px 0"
                            }}
                            current={currentTL}
                            pageSize={pageSizeTL}
                            total={totalTheLoai}
                            onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            showTotal={(total, range) => (
                                <div>{range[0]}-{range[1]} trên {total} thể loại</div>
                            )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        />

                        <Create                            
                            openCreateTL={openCreateTL}
                            setOpenCreateTL={setOpenCreateTL}
                            fetchListTL={fetchListTL}
                        />
                        
                        <Update
                        fetchListTL={fetchListTL}
                        dataUpdateTheLoai={dataUpdateTheLoai}
                        setDataUpdateTheLoai={setDataUpdateTheLoai}
                        openUpdateTL={openUpdateTL}
                        setOpenUpdateTL={setOpenUpdateTL}
                        />
                    </div>
                </div>
                </div>
            </div>                                                          
        </div>
    )
}
export default Category