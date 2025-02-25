import { useEffect, useState } from "react"
import { Button, Col, message, notification, Pagination, Popconfirm, Row, Select, Space, Table } from "antd"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { IoMdAdd } from "react-icons/io"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { deleteCauHoi, fetchAllCauHoi } from "../../../services/cauHoiAPI"
import Update from "../../../components/Admin/CauHoi/Update"



const CauHoi = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [dataCauHoi, setDataCauHoi] = useState([])

    const [dataUpdateCauHoi, setDataUpdateCauHoi] = useState(null)
    const [openUpdateCauHoi, setOpenUpdateCauHoi] = useState(false)

    const [totalCauHoi, setTotalCauHoi] = useState(0);
    const [currentCauHoi, setCurrentCauHoi] = useState(1)
    const [pageSizeCauHoi, setPageSizeCauHoi] = useState(10)

    // dùng để search 
    const [tenSearch, setTenSearch] = useState('');
    const [selectedCauHoi, setSelectedCauHoi] = useState([]);

    const onChangeCauHoi = async (e) => {
        console.log("e: ", e);
        setSelectedCauHoi(e)
    }

    useEffect(() => {
        fetchListCauHoi()
    }, [currentCauHoi, pageSizeCauHoi, tenSearch])

    useEffect(() => {
        if (selectedCauHoi.length > 0) {
            fetchListCauHoi(); 
        } else {
            fetchListCauHoi(); 
        }
    }, [selectedCauHoi]);

    const fetchListCauHoi = async (id) => {
        setLoadingTable(true)
        let query = `page=${currentCauHoi}&limit=${pageSizeCauHoi}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (tenSearch) {
            query += `&search=${encodeURIComponent(tenSearch)}`;
        }      
        if (selectedCauHoi && selectedCauHoi.length > 0) {
            query += `&locTheoCauHoiDaTraLoi=${encodeURIComponent(JSON.stringify(selectedCauHoi))}`;
        }
        const res = await fetchAllCauHoi(query)
        console.log("res TL: ", res);
        if (res && res.data) {
            setDataCauHoi(res.data)
            setTotalCauHoi(res.totalCauHoi); // Lưu tổng số 
        }
        setLoadingTable(false)
    }

    const handleDeleteCauHoi = async (id) => {

        const res = await deleteCauHoi(id)
        if(res){
            notification.success({
                message: "Xóa thông tin câu hỏi",
                description: "Bạn đã xoá thành công"
            })
            await fetchListCauHoi()
        } else {
            notification.error({
                message: "Xoá",
                description: JSON.stringify(res.message)
            })
        }
    }

    const onChangePagination = (page, pageSize, sorter = null) => {
        setCurrentCauHoi(page);
        setPageSizeCauHoi(pageSize); // Cập nhật pageSize nếu cần        
    };

    const columnsCauHoi = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (currentCauHoi - 1) * pageSizeCauHoi}
                </>
              )
            },
            width: 50
        },       
        {
            title: 'Người hỏi',
            dataIndex: 'fullNameEmail',
            key: 'fullNameEmail',
            render: (text, record) => <div>
                Email: <span style={{color: "navy"}}>{record?.email}</span> <br/>
                Họ tên: <span style={{color: "green"}}>{record?.fullName}</span>
            </div>,
        }, 
        {
            title: 'Câu hỏi?',
            dataIndex: 'cauHoi',
            key: 'cauHoi',
            width: 300,
            render: (text) => <span> {text}?</span>,
        },  
        {
            title: 'Câu trả lời',
            dataIndex: 'cauTraLoi',
            key: 'cauTraLoi',
            render: (text, record) => <div>
                {
                    record?.cauTraLoi ? 
                    <div className="truncate"  dangerouslySetInnerHTML={{ __html: record?.cauTraLoi }} />  :
                    <span style={{color: "red"}}> ⚠ chưa trả lời</span>
                }
            </div>,
        },
        {
          title: 'Chức năng',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                <EditOutlined style={{color: "orange", fontSize: "20px"}} onClick={() => {
                    console.log("record update: ", record);
                    setOpenUpdateCauHoi(true)
                    setDataUpdateCauHoi(record)
                }} /> 

                <Popconfirm
                    title={`xóa câu hỏi này?`}
                    description="Bạn có chắc chắn muốn xoá?"
                    onConfirm={() => handleDeleteCauHoi(record._id)}                   
                    onCancel={() => message.error('hủy xóa')}
                    okText="Xác nhận xoá"
                    cancelText="Không Xoá"
                >
                    <DeleteOutlined style={{color: "red", fontSize: "20px"}} />
                </Popconfirm>
            </Space>
          ),
          width: 110
        },
    ];      
    
    return (
        <div className="row mt-4">
        <NavbarTop 
        title={'CauHoi'} 
        placeholder={'Search tên hoặc câu hỏi...'} 
        searchTheoName={setTenSearch} />

        <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
            <div className="card z-index-2 h-100">
            <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                <h5 style={{fontFamily: "Arial"}}>Danh sách câu hỏi</h5>
                <Select
                    showSearch
                    mode="multiple"
                    placeholder="Lọc câu hỏi"
                    value={selectedCauHoi}
                    onChange={(e) => onChangeCauHoi(e)}
                    style={{
                        width: '250px',
                    }}
                    options={[
                        {
                            label: 'Đã trả lời',
                            value: 'darep'
                        },
                        {
                            label: 'Chưa trả lời',
                            value: 'chuarep'
                        }
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
                            rowKey={"_id"} 
                            // onChange={onChange}
                            pagination={false}
                            loading={loadingTable}
                            columns={columnsCauHoi} 
                            dataSource={dataCauHoi} />
                        </Col>
                    </Row>

                    <Pagination 
                        style={{
                            fontSize: "17px",
                            display: "flex",
                            justifyContent: "center",
                            margin: "10px 0 20px 0"
                        }}
                        current={currentCauHoi}
                        pageSize={pageSizeCauHoi}
                        total={totalCauHoi}
                        onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                        showSizeChanger={true}
                        showQuickJumper={true}
                        showTotal={(total, range) => (
                            <div>{range[0]}-{range[1]} trên {total} câu hỏi</div>
                        )}
                        locale={{
                            items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                            jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                            jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                            page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                        }}
                    />
                    
                    <Update
                    fetchListCauHoi={fetchListCauHoi}
                    dataUpdateCauHoi={dataUpdateCauHoi}
                    setDataUpdateCauHoi={setDataUpdateCauHoi}
                    openUpdateCauHoi={openUpdateCauHoi}
                    setOpenUpdateCauHoi={setOpenUpdateCauHoi}
                    /> 
                </div>
            </div>
            </div>
        </div>                                                          
    </div>
    )
}
export default CauHoi