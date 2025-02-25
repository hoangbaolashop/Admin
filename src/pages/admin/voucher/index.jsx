import { useEffect, useState } from "react"
import { deleteVoucher, fetchAllVoucher } from "../../../services/voucherAPI"
import { Button, Col, message, notification, Pagination, Popconfirm, Row, Space, Table } from "antd"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { IoMdAdd } from "react-icons/io"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import Create from "../../../components/Admin/Voucher/Create"
import Update from "../../../components/Admin/Voucher/Update"

const Voucher = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [dataVoucher, setDataVoucher] = useState([])

    const [openCreateVoucher, setOpenCreateVoucher] = useState(false)
    const [dataUpdateVoucher, setDataUpdateVoucher] = useState(null)
    const [openUpdateVoucher, setOpenUpdateVoucher] = useState(false)

    const [totalVoucher, setTotalVoucher] = useState(0);
    const [currentVoucher, setCurrentVoucher] = useState(1)
    const [pageSizeVoucher, setPageSizeVoucher] = useState(5)

    // dùng để search 
    const [tenVoucher, setTenVoucher] = useState('');

    useEffect(() => {
        fetchListVoucher()
    }, [currentVoucher, pageSizeVoucher, tenVoucher])

    const fetchListVoucher = async (id) => {
        setLoadingTable(true)
        let query = `page=${currentVoucher}&limit=${pageSizeVoucher}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (tenVoucher) {
            query += `&code=${encodeURIComponent(tenVoucher)}`;
        }      
    
        const res = await fetchAllVoucher(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataVoucher(res.data)
            setTotalVoucher(res.totalVoucher); // Lưu tổng số 
        }
        setLoadingTable(false)
    }

    const handleDeleteVoucher = async (id) => {

        const res = await deleteVoucher(id)
        if(res){
            notification.success({
                message: "Xóa thông tin voucher",
                description: "Bạn đã xoá thành công"
            })
            await fetchListVoucher()
        } else {
            notification.error({
                message: "Xoá",
                description: JSON.stringify(res.message)
            })
        }
    }

    const onChangePagination = (page, pageSize, sorter = null) => {
        setCurrentVoucher(page);
        setPageSizeVoucher(pageSize); // Cập nhật pageSize nếu cần        
    };

    const columnsVoucher = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (currentVoucher - 1) * pageSizeVoucher}
                </>
              )
            },
            width: 100
        },       
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a>{text}</a>,
        }, 
        {
            title: 'Điều kiện',
            dataIndex: 'dieuKien',
            key: 'dieuKien',
            render: (text) => <a style={{color: "gray", fontWeight: "500"}}> Tổng tiền đơn hàng phải lớn hơn &nbsp;<span style={{color: "red"}}>{Number(text).toLocaleString()}đ</span></a>,
        },  
        {
            title: 'Giảm giá (%)',
            dataIndex: 'giamGia',
            key: 'giamGia',
            render: (text) => <a style={{color: "navy", fontWeight: "500"}}>{text} %</a>,
        }, 
        {
            title: 'Thời gian hết hạn',
            dataIndex: 'thoiGianHetHan',
            key: 'thoiGianHetHan',
            render: (text) => <a style={{color: "navy", fontWeight: "500"}}>{text}</a>,
        },            
        {
          title: 'Chức năng',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                <EditOutlined style={{color: "orange", fontSize: "20px"}} onClick={() => {
                    console.log("record update: ", record);
                    setOpenUpdateVoucher(true)
                    setDataUpdateVoucher(record)
                }} /> 

                <Popconfirm
                    title={`xóa Voucher`}
                    description="Bạn có chắc chắn muốn xoá?"
                    onConfirm={() => handleDeleteVoucher(record._id)}                   
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
        title={'Voucher'} 
        placeholder={'Search Voucher...'} 
        searchTheoName={setTenVoucher} />

        <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
            <div className="card z-index-2 h-100">
            <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                <h6>Voucher List</h6>
                <Button size='large' type="primary" icon={<IoMdAdd size={22} />} onClick={() => setOpenCreateVoucher(true)}>Create Voucher</Button>
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
                            columns={columnsVoucher} 
                            dataSource={dataVoucher} />
                        </Col>
                    </Row>

                    <Pagination 
                        style={{
                            fontSize: "17px",
                            display: "flex",
                            justifyContent: "center",
                            margin: "10px 0 20px 0"
                        }}
                        current={currentVoucher}
                        pageSize={pageSizeVoucher}
                        total={totalVoucher}
                        onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                        showSizeChanger={true}
                        showQuickJumper={true}
                        showTotal={(total, range) => (
                            <div>{range[0]}-{range[1]} trên {total} Voucher</div>
                        )}
                        locale={{
                            items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                            jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                            jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                            page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                        }}
                    />

                    <Create                            
                        openCreateVoucher={openCreateVoucher}
                        setOpenCreateVoucher={setOpenCreateVoucher}
                        fetchListVoucher={fetchListVoucher}
                    />
                    <Update
                    fetchListVoucher={fetchListVoucher}
                    dataUpdateVoucher={dataUpdateVoucher}
                    setDataUpdateVoucher={setDataUpdateVoucher}
                    openUpdateVoucher={openUpdateVoucher}
                    setOpenUpdateVoucher={setOpenUpdateVoucher}
                    /> 
                </div>
            </div>
            </div>
        </div>                                                          
    </div>
    )
}
export default Voucher