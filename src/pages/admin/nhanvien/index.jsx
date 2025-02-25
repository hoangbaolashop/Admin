import { useEffect, useState } from "react"
import NavbarTop from "../../../components/Admin/Navbar/NavbarTop"
import { Button, Col, message, notification, Pagination, Popconfirm, Row, Space, Switch, Table, Tag, Tooltip } from "antd"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { deleteAccAdmin, fetchAllAccAdmin, khoaAccAdmin } from "../../../services/loginAdminAPI"
import { IoSettingsSharp } from "react-icons/io5"
import Update from "../../../components/Admin/NhanVien/Update"

const NhanVienPage = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [loadingTableKhoa, setLoadingTableKhoa] = useState(false)
    const [dataAccKH, setDataAccKH] = useState([])

    const [dataUpdateAccKH, setDataUpdateAccKH] = useState(null)
    const [openUpdateAccKH, setOpenUpdateAccKH] = useState(false)

    const [totalAccKH, setTotalAccKH] = useState(0);
    const [currentAccKH, setCurrentAccKH] = useState(1)
    const [pageSizeAccKH, setPageSizeAccKH] = useState(5)

    // dùng để search 
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        fetchListAccKH()
    }, [currentAccKH, pageSizeAccKH, fullName])
   
    const handleDeleteAccKH = async (id) => {
    
        const res = await deleteAccAdmin(id)
        if(res){
            notification.success({
                message: "Xóa tài khoản",
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

    const fetchListAccKH= async () => {
        setLoadingTable(true)
        let query = `page=${currentAccKH}&limit=${pageSizeAccKH}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (fullName) {
            query += `&fullName=${encodeURIComponent(fullName)}`;
        }        
    
        const res = await fetchAllAccAdmin(query)
        if (res && res.data) {
            setDataAccKH(res.data)
            setTotalAccKH(res.totalAccAdmin); // Lưu tổng số 
        }
        setLoadingTable(false)
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
            </div>,
            // width: 180
        }, 
        {
            title: 'Họ Và Tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => <a>{record?.lastName} {record?.firstName}</a>,
            // width: 100
        },  
        {
            title: 'Quyền truy cập',
            dataIndex: 'quyenTc',
            key: 'quyenTc',
            render: (text, record) => (
                <a>
                    {record.roleId.key === 'Admin' ? <Tag color="blue">{record.roleId.name}</Tag> : <Tag color="red">{record.roleId.name}</Tag>}
                </a>
            ),
            // width: 100
        },         
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (_, record) => (
                <Space size="middle">                        
                    <Switch 
                    loading={loadingTableKhoa}
                        checked={record.isActive}  // Giả sử là `isActive` trong dữ liệu tài khoản
                        onChange={(checked) => onChange(checked, record)} 
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Đang khóa"
                    />
                </Space>
              ),
            // width: 100
        },          
        {
          title: 'Chức năng',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                <Tooltip title="phân quyền cho tài khoản này" color={'green'} key={'green'}>
                    <IoSettingsSharp style={{color: "orange", fontSize: "20px", cursor: "pointer"}} onClick={() => {
                        console.log("record update: ", record);
                        setOpenUpdateAccKH(true)
                        setDataUpdateAccKH(record)
                    }} /> 
                </Tooltip>

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
            </Space>
          ),
        //   width: 200
        },
    ];   

    const onChange = async (checked, record) => {
        const updatedStatus = checked ? true : false; // true nếu bật (mở tài khoản), false nếu tắt (khóa tài khoản)
        
        try {
            setLoadingTableKhoa(true)
            // Gửi yêu cầu cập nhật trạng thái tài khoản đến server (ví dụ, sử dụng fetch hoặc axios)
            // const response = await axios.put(`/api/account/${record._id}`, { isActive: updatedStatus });
            const response = await khoaAccAdmin(record._id, updatedStatus)
    
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
            setLoadingTableKhoa(false)
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            message.error("Cập nhật trạng thái thất bại!");
        }
    };

    console.log("data admin: ", dataAccKH);
    
    return (
        <div className="row mt-4">
            <NavbarTop 
            title={'Users'} 
            placeholder={'Search Users...'} 
            searchTheoName={setFullName} />

            <div className="col-lg-11 mb-lg-0 mb-4" style={{margin: "auto"}}>
                <div className="card z-index-2 h-100">
                <div className="card-header pb-0 pt-3 bg-transparent" style={{display: "flex", justifyContent: "space-between"}}>
                    <h6>Danh sách tài khoản nhân viên</h6>
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
export default NhanVienPage