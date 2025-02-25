import { useEffect, useState } from "react"
import { Button, Col, message, notification, Pagination, Popconfirm, Row, Space, Table } from "antd"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { IoMdAdd } from "react-icons/io"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { deleteHopQua, fetchAllHopQua } from "../../../services/hopQuaAPI"
import Create from "../../../components/Admin/HopQua/Create"
import Update from "../../../components/Admin/HopQua/Update"


const HopQua = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [dataHopQua, setDataHopQua] = useState([])

    const [openCreateHopQua, setOpenCreateHopQua] = useState(false)
    const [dataUpdateHopQua, setDataUpdateHopQua] = useState(null)
    const [openUpdateHopQua, setOpenUpdateHopQua] = useState(false)

    const [totalHopQua, setTotalHopQua] = useState(0);
    const [currentHopQua, setCurrentHopQua] = useState(1)
    const [pageSizeHopQua, setPageSizeHopQua] = useState(10)

    // dùng để search 
    const [tenHopQua, setTenHopQua] = useState('');

    useEffect(() => {
        fetchListHopQua()
    }, [currentHopQua, pageSizeHopQua, tenHopQua])

    const fetchListHopQua = async (id) => {
        setLoadingTable(true)
        let query = `page=${currentHopQua}&limit=${pageSizeHopQua}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (tenHopQua) {
            query += `&tenHopQua=${encodeURIComponent(tenHopQua)}`;
        }      
    
        const res = await fetchAllHopQua(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataHopQua(res.data)
            setTotalHopQua(res.totalHopQua); // Lưu tổng số 
        }
        setLoadingTable(false)
    }

    const handleDeleteHopQua = async (id) => {

        const res = await deleteHopQua(id)
        if(res){
            notification.success({
                message: "Xóa thông tin hộp quà",
                description: "Bạn đã xoá thành công"
            })
            await fetchListHopQua()
        } else {
            notification.error({
                message: "Xoá",
                description: JSON.stringify(res.message)
            })
        }
    }

    const onChangePagination = (page, pageSize, sorter = null) => {
        setCurrentHopQua(page);
        setPageSizeHopQua(pageSize); // Cập nhật pageSize nếu cần        
    };

    const columnsHopQua = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (currentHopQua - 1) * pageSizeHopQua}
                </>
              )
            },
            width: 100
        },       
        {
            title: 'Tên hộp quà',
            dataIndex: 'tenHopQua',
            key: 'tenHopQua',
            render: (text) => <a>{text}</a>,
        }, 
        {
            title: 'Nội dung chat',
            dataIndex: 'messageHopQua',
            key: 'messageHopQua',
            render: (text) => <span> {text}</span>,
        },  
        {
            title: 'Giảm giá (%)',
            dataIndex: 'IdVoucher',
            key: 'IdVoucher',
            render: (text, record) => 
                <a style={{color: "navy", fontWeight: "500"}}>                
                {record?.IdVoucher ? <>
                    {record?.IdVoucher?.code} - Giảm {record?.IdVoucher?.giamGia}%
                </> : <span style={{color: "gray", fontWeight: "400"}}>Không có quà</span>}
                </a>,
            width: 150
        },  
        // {
        //     title: 'Tài khoản nhận quà',
        //     dataIndex: 'IdKH',
        //     key: 'IdKH',
        //     render: (text, record) => <a style={{color: "navy", fontWeight: "500"}}></a>,
        // },            
        {
          title: 'Chức năng',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                <EditOutlined style={{color: "orange", fontSize: "20px"}} onClick={() => {
                    console.log("record update: ", record);
                    setOpenUpdateHopQua(true)
                    setDataUpdateHopQua(record)
                }} /> 

                <Popconfirm
                    title={`xóa Hộp quà`}
                    description="Bạn có chắc chắn muốn xoá?"
                    onConfirm={() => handleDeleteHopQua(record._id)}                   
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

    console.log("dataHopQua: ", dataHopQua);
    

    return (
        <div className="row mt-4">
        <NavbarTop 
        title={'HopQua'} 
        placeholder={'Search HopQua...'} 
        searchTheoName={setTenHopQua} />

        <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
            <div className="card z-index-2 h-100">
            <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                <h6>Hộp quà List</h6>
                <Button size='large' type="primary" icon={<IoMdAdd size={22} />} onClick={() => setOpenCreateHopQua(true)}>Create Hộp quà</Button>
            </div>
            <div className="card-body p-3">
                <div className="chart">
                {/* <canvas id="chart-line" className="chart-canvas" height={300} /> */}
                    <Row>
                        <Col span={24}>
                            <Table 
                            rowKey={"_id"} 
                            // onChange={onChange}
                            pagination={false}
                            loading={loadingTable}
                            columns={columnsHopQua} 
                            dataSource={dataHopQua} />
                        </Col>
                    </Row>

                    <Pagination 
                        style={{
                            fontSize: "17px",
                            display: "flex",
                            justifyContent: "center",
                            margin: "10px 0 20px 0"
                        }}
                        current={currentHopQua}
                        pageSize={pageSizeHopQua}
                        total={totalHopQua}
                        onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                        showSizeChanger={true}
                        showQuickJumper={true}
                        showTotal={(total, range) => (
                            <div>{range[0]}-{range[1]} trên {total} mã trúng thưởng</div>
                        )}
                        locale={{
                            items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                            jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                            jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                            page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                        }}
                    />

                    <Create                            
                        openCreateHopQua={openCreateHopQua}
                        setOpenCreateHopQua={setOpenCreateHopQua}
                        fetchListHopQua={fetchListHopQua}
                    />
                    
                    <Update
                    fetchListHopQua={fetchListHopQua}
                    dataUpdateHopQua={dataUpdateHopQua}
                    setDataUpdateHopQua={setDataUpdateHopQua}
                    openUpdateHopQua={openUpdateHopQua}
                    setOpenUpdateHopQua={setOpenUpdateHopQua}
                    /> 
                </div>
            </div>
            </div>
        </div>                                                          
    </div>
    )
}
export default HopQua