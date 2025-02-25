import { Avatar, Button, Checkbox, Col, message, notification, Pagination, Popconfirm, Row, Select, Space, Table, Tag, Tooltip } from "antd"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { IoMdAdd } from "react-icons/io"
import { useEffect, useState } from "react"
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons"
import moment from "moment"
import Create from "../../../components/Admin/Product/Create"
import { fetchListHangSX } from "../../../redux/HangSX/hangSXSlice"
import { useDispatch, useSelector } from "react-redux"
import { deleteNhieuProduct, deleteProduct, fetchAllProduct } from "../../../services/productAPI"
import { fetchListCategory } from "../../../redux/TheLoai/theLoaiSlice"
import ViewDetail from "../../../components/Admin/Product/ViewDetail"
import Update from "../../../components/Admin/Product/Update"
import { GrPowerReset } from "react-icons/gr"
import ImportSP from "../../../components/Admin/Product/ImportSP"
import { FaFileImport } from "react-icons/fa"
import { FcDeleteDatabase } from "react-icons/fc";

const Products = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [loadingXoaNhieuSP, setLoadingXoaNhieuSP] = useState(false)
    const [dataSP, setDataSP] = useState([])
    const [openCreateSP, setOpenCreateSP] = useState(false)

    const [openUpdateSP, setOpenUpdateSP] = useState(false)
    const [dataUpdateSP, setDataUpdateSP] = useState(null)

    const [openViewSP, setOpenViewSP] = useState(false)
    const [dataViewSP, setDataViewSP] = useState(null)

    const [totalSP, setTotalSP] = useState(0);
    const [currentSP, setCurrentSP] = useState(1)
    const [pageSizeSP, setPageSizeSP] = useState(10)
    const [sortQuery, setSortQuery] = useState("sort=createdAt");
    const [selectedLocTheoGia, setSelectedLocTheoGia] = useState([]);
    const [selectedLoaiSP, setSelectedLoaiSP] = useState([]);

    const [selectedProductIds, setSelectedProductIds] = useState([]);
    // dùng để search 
    const [tenSP, setTenSP] = useState('');
    

    const [openModalImport, setOpenModalImport] = useState(false);
    
    const allCategory = useSelector(s => s.category.listCategorys.data)

    const locTheoGia = [
        {_id: 0, value: "1-999999999", label: "Tất cả"},
        {_id: 1, value: "1-100000", label: "Dưới 100k"},
        {_id: 2, value: "100001-500000", label: "100k - 500k"},
        {_id: 3, value: "500001-5000000", label: "500k - 5M"},
        {_id: 4, value: "5000001-20000000", label: "5M - 20M"},
        {_id: 5, value: "20000001-999999999", label: "20M đổ lên"},
    ]

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchListHangSX())
        dispatch(fetchListCategory())
    }, [])

    useEffect(() => {
        fetchListSP()
    }, [currentSP, pageSizeSP, tenSP, sortQuery])

    useEffect(() => {
        if (selectedLoaiSP.length > 0) {
            fetchListSP(); // Gọi lại hàm fetch khi selectedLoaiSP thay đổi
        } else {
            fetchListSP(); // Nếu không có thể loại nào được chọn, fill lại giá trị bandđầu
        }
    }, [selectedLoaiSP]); // Lắng nghe sự thay đổi của selectedLoaiSP

    useEffect(() => {
        if (selectedLocTheoGia.length > 0) {
            fetchListSP();
        } else {
            fetchListSP(); // Nếu không có loại nào được chọn, fill lại giá trị bandđầu
        }
    }, [selectedLocTheoGia]);

    const resetPage = () => {
        setSelectedLoaiSP([])
        setSelectedLocTheoGia([])
    }
    const fetchListSP = async () => {
        setLoadingTable(true)
        let query = `page=${currentSP}&limit=${pageSizeSP}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (tenSP) {
            query += `&TenSP=${encodeURIComponent(tenSP)}`;
        }  
        if (sortQuery) {
            query += `&${sortQuery}`;
        } 
        // Nếu selectedLoaiSP là mảng, chuyển nó thành chuỗi query
        if (selectedLoaiSP && selectedLoaiSP.length > 0) {
            query += `&locTheoLoai=${encodeURIComponent(JSON.stringify(selectedLoaiSP))}`;
        }
        if (selectedLocTheoGia) {
            query += `&locTheoGia=${encodeURIComponent(selectedLocTheoGia)}`;
        } 
   
    
        const res = await fetchAllProduct(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataSP(res.data)
            setTotalSP(res.totalSanPham); // Lưu tổng số 
        }
        setLoadingTable(false)
    }

    const handleDeleteSP = async (id) => {
        const res = await deleteProduct(id)
        if(res){
            notification.success({
                message: "Xóa thông tin sản phẩm",
                description: "Bạn đã xoá thành công"
            })
            await fetchListSP()
        } else {
            notification.error({
                message: "Xoá",
                description: JSON.stringify(res.message)
            })
        }
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
        setCurrentSP(page);
        setPageSizeSP(pageSize); // Cập nhật pageSize nếu cần

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


    const columnsSP = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (currentSP - 1) * pageSizeSP}
                </>
              )
            },
            width: 50
        },
        {
            title: 'Image',
            dataIndex: 'Image',            
            key: 'Image',
            render: (text) => {
                const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${text}`;
                return <Avatar style={{border: "1px solid navy", backgroundColor: "whitesmoke"}} src={imageUrl} shape="square" size={94} icon={<UserOutlined />} />

                //  <img src={imageUrl} alt="icon" style={{ width: 50, height: 50 }} />
            },
            width: 110
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'TenSP',
            key: 'TenSP',
            sorter: true,
            render: (text) => <a>{text}</a>,
            width: 350
        },  
        {
            title: 'Size - Số lượng - Giá bán',
            dataIndex: 'sizes',
            sorter: true,
            key: 'sizes',
            width: "370px",
            render: (text, record) => {
                // Duyệt qua mảng sizes và tạo chuỗi
                return (
                    <ul>
                        {record.sizes.map((item, index) => (
                            <li key={index}>
                                <span style={{color: "navy"}}>Cấu hình: </span> 
                                <span style={{color: "green"}}>{item.size}</span> - &nbsp;
                                <span style={{color: "navy"}}> Tồn kho: </span>
                                <span style={{color: "green"}}>{item.quantity}</span>  -  &nbsp;
                                <span style={{color: "red"}}>{item.price.toLocaleString()} </span> 
                                <span style={{color: "navy"}}>VNĐ</span>
                            </li>
                        ))}
                    </ul>
                );
            }, 
            sorter: (a, b) => {
                // So sánh price[0] của từng sản phẩm
                const priceA = a.sizes[0] ? a.sizes[0].price : 0; // Nếu không có size thì giá trị mặc định là 0
                const priceB = b.sizes[0] ? b.sizes[0].price : 0; // Tương tự cho sản phẩm B
                return priceA - priceB; // Sắp xếp theo thứ tự tăng dần
            },         
        },  
        {
            title: 'Tồn kho',
            dataIndex: 'SoLuongTon',
            key: 'SoLuongTon',
            render: (text, record) => {
                const totalQuantity = record.sizes.reduce((total, size) => total + size.quantity, 0);
                // Kiểm tra số lượng tồn kho và hiển thị thông tin tương ứng
                return totalQuantity === 0 ? (
                  <Tag color="red">Hết hàng</Tag>
                ) : (
                    <Tag color="blue">Còn hàng: {totalQuantity}</Tag>
                );
            },
        },  
        // {
        //     title: 'Ngày thêm',
        //     width: "150px",
        //     dataIndex: 'createdAt',
        //     sorter: true,
        //     render: (text, record, index) => {
        //         return (
        //             <>{moment(record.createdAt).format('DD-MM-YYYY hh:mm:ss')}</>
        //         )
        //     }
        // },  
        {
            title: 'Ngày cập nhật',
            width: "150px",
            sorter: true,
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
                <EyeOutlined style={{color: "green", fontWeight: "bold", cursor: "pointer", fontSize: "18px"}} 
                    onClick={() => {
                        console.log("record: ", record);    
                        setOpenViewSP(true)    
                        setDataViewSP(record)                             
                    }} 
                />

                <EditOutlined style={{color: "orange", fontSize: "18px"}} onClick={() => {
                    console.log("record update: ", record);
                    setOpenUpdateSP(true)
                    setDataUpdateSP(record)
                }} /> 

                <Popconfirm
                    title={`xóa sản phẩm`}
                    description="Bạn có chắc chắn muốn xoá?"
                    onConfirm={() => handleDeleteSP(record._id)}
                    onCancel={() => message.error('hủy xóa')}
                    okText="Xác nhận xoá"
                    cancelText="Không Xoá"
                >
                    <DeleteOutlined style={{color: "red", fontSize: "18px"}} />
                </Popconfirm>
                
            </Space>
          ),
          width: 150
        },
    ]; 

    const onChangeTheoGia = async (e) => {
        console.log("e: ", e);
        setSelectedLocTheoGia(e)
    }
    const onChangeTheoLoai = async (e) => {
        console.log("e: ", e);
        setSelectedLoaiSP(e)
    }
    console.log("selectedLocTheoGia: ",selectedLocTheoGia);
    console.log("selectedLoaiSP: ",selectedLoaiSP);        
    console.log("selectedProductIds: ",selectedProductIds);
    console.log("dataSP: ",dataSP);

    // Hàm xử lý thay đổi khi checkbox được chọn hoặc bỏ chọn
    const onSelectChange = (selectedRowKeys) => {
        console.log("selectedRowKeys: ",selectedRowKeys);
        setSelectedProductIds(selectedRowKeys);
    };

    // Xóa các sản phẩm đã chọn
    const handleBulkDelete = async () => {
        if (selectedProductIds.length === 0) {
            message.warning('Vui lòng chọn ít nhất một sản phẩm để xóa');
            return;
        }

        try {
            setLoadingXoaNhieuSP(true)
            // Gửi yêu cầu xóa nhiều sản phẩm
            const response = await deleteNhieuProduct(selectedProductIds)

            // Xử lý sau khi xóa thành công
            message.success(response.message);
            await fetchListSP()
            setSelectedProductIds([]); // Xóa các lựa chọn đã chọn
            setLoadingXoaNhieuSP(false)
        } catch (error) {
            message.error('Đã xảy ra lỗi khi xóa sản phẩm');
        }
    };

    return (
        <div className="row mt-4">
            <NavbarTop
            title={'Products'} 
            placeholder={'Search product...'} 
            searchTheoName={setTenSP}
            />
            <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
                <div className="card z-index-2 h-100">
                <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                    {/* <h6 className="text-capitalize">Products List</h6> */}
                    <div style={{float: "left"}}>
                        <Row gutter={[0, 5]}> 
                            <Col span={2}>
                                <Tooltip title="Xóa các sản phẩm đã chọn" color={'green'} key={'green'}>
                                    <Popconfirm
                                        title={`Xóa các sản phẩm đã chọn`}
                                        description="Bạn có chắc chắn muốn xoá?"
                                        onConfirm={() => handleBulkDelete()}
                                        onCancel={() => message.error('hủy xóa')}
                                        okText="Chắc chắn xóa"
                                        cancelText="Không Xoá"
                                    >
                                        <FcDeleteDatabase
                                            size={35}
                                            loading={loadingXoaNhieuSP}
                                            // onClick={handleBulkDelete} 
                                            disabled={selectedProductIds.length === 0} 
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Popconfirm>                                    
                                </Tooltip>
                            </Col>                           
                            <Col span={10}>
                                <Select
                                    showSearch
                                    placeholder="Lọc theo giá"
                                    value={selectedLocTheoGia}
                                    onChange={(e) => onChangeTheoGia(e)}
                                    style={{
                                        width: '200px',
                                    }}
                                    options={locTheoGia.map((item) => ({
                                        value: item.value,
                                        label: item.label,
                                    }))}
                                    filterOption={(input, option) => {
                                        return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                                    }}  
                                />
                            </Col>
                            <Col span={11}>
                                <Select
                                    showSearch
                                    mode="multiple"
                                    placeholder="Lọc theo loại sản phẩm"
                                    value={selectedLoaiSP}
                                    onChange={(e) => onChangeTheoLoai(e)}
                                    style={{
                                        width: '300px',
                                    }}
                                    options={allCategory?.map((item) => ({
                                        value: item._id,
                                        label: item.TenLoaiSP,
                                    }))}
                                    filterOption={(input, option) => {
                                        return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                                    }}  
                                />
                            </Col>                            
                        </Row>                                                                      
                    </div>
                    <div style={{float: "right"}}>
                        <Button size='large' type="primary" icon={<FaFileImport size={20} />} onClick={() => setOpenModalImport(true)}>Import</Button> &nbsp;&nbsp;&nbsp;                     
                        <Button size='large' type="primary" icon={<IoMdAdd size={22} />} onClick={() => setOpenCreateSP(true)}>Create SP</Button> &nbsp;&nbsp;&nbsp;                       
                        <Button size='large' danger title="Reset page" style={{borderRadius: "50%"}} icon={<GrPowerReset size={18} />} onClick={() => resetPage()}></Button>
                        {/* <Button 
                            type="primary" 
                            onClick={handleBulkDelete} 
                            disabled={selectedProductIds.length === 0} 
                            style={{ marginBottom: 16 }}
                        >
                            Xóa các sản phẩm đã chọn
                        </Button> */}
                        

                    </div>
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
                                columns={columnsSP} 
                                dataSource={dataSP}
                                rowSelection={{
                                    type: 'checkbox',
                                    selectedRowKeys: selectedProductIds,
                                    onChange: onSelectChange
                                }}
                                />
                            </Col>
                        </Row>
                        <Pagination 
                            style={{
                                fontSize: "17px",
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px 0 20px 0"
                            }}
                            current={currentSP}
                            pageSize={pageSizeSP}
                            total={totalSP}
                            onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            showTotal={(total, range) => (
                                <div>{range[0]}-{range[1]} trên {total} sản phẩm</div>
                            )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        />

                        <Create
                        openCreateSP={openCreateSP}
                        setOpenCreateSP={setOpenCreateSP}
                        fetchListSP={fetchListSP}
                        />

                        <ViewDetail
                        openViewSP={openViewSP}
                        setOpenViewSP={setOpenViewSP}
                        dataViewSP={dataViewSP}
                        setDataViewSP={setDataViewSP}
                        />

                        <Update
                        openUpdateSP={openUpdateSP}
                        setOpenUpdateSP={setOpenUpdateSP}
                        fetchListSP={fetchListSP}
                        dataUpdateSP={dataUpdateSP}
                        setDataUpdateSP={setDataUpdateSP}
                        />

                        <ImportSP
                        setOpenModalImport={setOpenModalImport}
                        openModalImport={openModalImport}
                        fetchListSP={fetchListSP}
                        />
                    </div>
                </div>
                </div>
            </div>                            
        </div>
    )
}
export default Products