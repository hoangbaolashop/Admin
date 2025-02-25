import { Avatar, Button, Col, message, notification, Pagination, Popconfirm, Row, Space, Table, Tag } from "antd"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { useEffect, useState } from "react"
import { IoMdAdd } from "react-icons/io";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import Create from "../../../components/Admin/HangSX/Create";
import { deleteHangSX, fetchAllHangSX } from "../../../services/hangSXAPI";
import { useDispatch, useSelector } from "react-redux";
import { fetchListCategory } from "../../../redux/TheLoai/theLoaiSlice";
import Update from "../../../components/Admin/HangSX/Update";

const HangSX = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [dataHSX, setDataHSX] = useState([])
    const [openCreateHSX, setOpenCreateHSX] = useState(false)
    const [dataUpdateHSX, setDataUpdateHSX] = useState(null)
    const [openUpdateHSX, setOpenUpdateHSX] = useState(false)
    const [totalHSX, setTotalHSX] = useState(0);
    const [currentHSX, setCurrentHSX] = useState(1)
    const [pageSizeHSX, setPageSizeHSX] = useState(5)
    // dùng để search 
    const [tenHSX, setTenHSX] = useState('');

    const dispatch = useDispatch()
    const dataTL = useSelector(state => state.category.listCategorys.data)
    

    useEffect(() => {
        dispatch(fetchListCategory())
    }, [])

    useEffect(() => {
        fetchListHSX()
    }, [currentHSX, pageSizeHSX, tenHSX])

    const fetchListHSX = async (id) => {
        setLoadingTable(true)
        let query = `page=${currentHSX}&limit=${pageSizeHSX}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (tenHSX) {
            query += `&TenHangSX=${encodeURIComponent(tenHSX)}`;
        }        
    
        const res = await fetchAllHangSX(query)
        console.log("res hangsx: ", res);
        if (res && res.data) {
            setDataHSX(res.data)
            setTotalHSX(res.totalHangSXP); // Lưu tổng số 
        }
        setLoadingTable(false)
    }

    const handleDeleteHSX = async (nameHSX) => {

        const res = await deleteHangSX(nameHSX)
        if(res){
            notification.success({
                message: "Xóa thông tin hãng sản phẩm",
                description: "Bạn đã xoá thành công"
            })
            await fetchListHSX()
        } else {
            notification.error({
                message: "Xoá",
                description: JSON.stringify(res.message)
            })
        }
    }
    
    const onChangePagination = (page, pageSize) => {
        setCurrentHSX(page);
        setPageSizeHSX(pageSize); // Cập nhật pageSize nếu cần
    };

    const columnsHSX = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (currentHSX - 1) * pageSizeHSX}
                </>
              )
            },
            width: 100
        },        
        {
            title: 'Tên hãng sản phẩm',
            dataIndex: 'TenHangSX',
            key: 'TenHangSX',
            render: (text) => <a>{text}</a>,
        }, 
        {
            title: 'Loại sản phẩm',
            dataIndex: 'IdLoaiSP',
            key: 'IdLoaiSP',
            render: (text) => (
                <ol>
                    {text.map(item => (
                        <li key={item._id}>{item.TenLoaiSP}</li>
                    ))}
                </ol>
            ),
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
                    setOpenUpdateHSX(true)
                    setDataUpdateHSX(record)
                }} /> 

                <Popconfirm
                    title={`xóa hãng phẩm`}
                    description="Bạn có chắc chắn muốn xoá?"
                    onConfirm={() => handleDeleteHSX(record.TenHangSX)}
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
            title={'HangSX'} 
            placeholder={'Search HangSX...'} 
            searchTheoName={setTenHSX} />

            <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
                <div className="card z-index-2 h-100">
                <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                    <h6>Hãng SX List</h6>
                    <Button size='large' type="primary" icon={<IoMdAdd size={22} />} onClick={() => setOpenCreateHSX(true)}>Create Hãng SX</Button>
                </div>
                <div className="card-body p-3">
                    <div className="chart">
                    {/* <canvas id="chart-line" className="chart-canvas" height={300} /> */}
                        <Row>
                            <Col span={24}>
                                <Table 
                                pagination={false}
                                loading={loadingTable}
                                columns={columnsHSX} 
                                dataSource={dataHSX} />
                            </Col>
                        </Row>

                        <Pagination 
                            style={{
                                fontSize: "17px",
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px 0 20px 0"
                            }}
                            current={currentHSX}
                            pageSize={pageSizeHSX}
                            total={totalHSX}
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
                            openCreateHSX={openCreateHSX}
                            setOpenCreateHSX={setOpenCreateHSX}
                            fetchListHSX={fetchListHSX}
                        />
                        
                        
                        <Update
                        fetchListHSX={fetchListHSX}
                        dataUpdateHSX={dataUpdateHSX}
                        setDataUpdateHSX={setDataUpdateHSX}
                        openUpdateHSX={openUpdateHSX}
                        setOpenUpdateHSX={setOpenUpdateHSX}
                        />
                    </div>
                </div>
                </div>
            </div>                                                          
        </div>
    )
}
export default HangSX