import { useEffect, useState } from "react";
import { fetchAllOrderHistory, fetchDoanhThu, fetchDoanhThuTheoNgay } from "../../services/historyOrderAPI";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';  // Thư viện Chart.js để vẽ biểu đồ hình tròn
import { Col, Row, DatePicker, message } from "antd";
import moment from "moment/moment";
const { RangePicker } = DatePicker;
ChartJS.register(ArcElement, Tooltip, Legend);
import { IoWarningOutline } from "react-icons/io5";

const AdminPage = () => {

    const [onlineUsers, setOnlineUsers] = useState(1);
    const [dataDH, setDataDH] = useState([]);
    const [dataDT, setDataDT] = useState([]);
    const [dataDTTheoNgay, setDataDTTheoNgay] = useState([]);
    const [salesData, setSalesData] = useState([]);    
    const [dates, setDates] = useState([]);

    const [startDate, endDate] = dates;
    

    useEffect(() => {
        findAllHistoryOrder()
        fetchSalesData()
    }, [])
    useEffect(() => {
        // Kiểm tra xem dates đã có giá trị hay chưa
        if (dates.length === 2) {
            fetchDataDoanhThuTheoNgay();
        }
    }, [dates]);  // Lắng nghe sự thay đổi của `dates`
    
    
    const findAllHistoryOrder = async () => {
        let query = `page=1&limit=10000`       
        let res = await fetchAllOrderHistory(query)
        if (res && res.data) {
            setDataDH(res.data.findOrder)
        }
    }

    const khongHuyDH = dataDH.filter(dh => dh.TrangThaiHuyDon === "Không Hủy").length
    const thanhCongDH = dataDH.filter(dh => dh.TinhTrangDonHang === "Đã giao hàng" && dh.TinhTrangThanhToan === "Đã Thanh Toán" && dh.TrangThaiHuyDon === "Không Hủy").length
    const daHuyDH = dataDH.filter(dh => dh.TrangThaiHuyDon === "Đã Hủy").length

    const fetchSalesData = async () => {
        try {
            const response = await fetchDoanhThu()
            if (response && response.data) {
                setDataDT(response.data)
            }           
        } catch (error) {
            console.error('Error fetching sales data', error);
        }
    };

    const fetchDataDoanhThuTheoNgay = async () => {
        try {                    
            const response = await fetchDoanhThuTheoNgay(startDate, endDate)
            console.log("res: ", response);
            
            if (response) {
                setDataDTTheoNgay(response.data)
            }  else {
                message.error(response.message)
            }      
        } catch (error) {
            console.error('Error fetching sales data', error);
        }
    };

    useEffect(() => {
        // if (dataDT.length > 0) {
        //     const formattedData = dataDT.map(item => ({
        //         date: `${item._id.day}-${item._id.month}-${item._id.year}`,  // Format ngày tháng năm
        //         sales: item.totalSales,
        //         soDonHang: item.totalOrders
        //     }));
        //     setSalesData(formattedData); // Cập nhật salesData khi dataDT thay đổi
        // }
    }, [dataDTTheoNgay]);

    useEffect(() => {
        if (dataDT.length > 0) {
            const formattedData = dataDT.map(item => ({
                date: `${item._id.day}-${item._id.month}-${item._id.year}`,  // Format ngày tháng năm
                sales: item.totalSales,
                soDonHang: item.totalOrders
            }));
            setSalesData(formattedData); // Cập nhật salesData khi dataDT thay đổi
        }
    }, [dataDT]);

    // Thông tin cấu hình biểu đồ hình tròn
    const chartData = {
        labels: dataDT.map(item => `Tháng ${item._id.month} năm ${item._id.year}`),  // Labels sẽ là tháng-năm
        datasets: [{
            label: 'Doanh thu theo tháng',
            data: dataDT.map(item => item.totalSales),  // Dữ liệu doanh thu
            backgroundColor: [
                'rgb(255, 99, 132)',  // Màu 1
                'rgb(54, 162, 235)',  // Màu 2
                'rgb(255, 205, 86)',  // Màu 3
                'rgb(75, 192, 192)',  // Màu 4
                'rgb(153, 102, 255)', // Màu 5
                'rgb(255, 159, 64)',  // Màu 6
                'rgb(255, 99, 71)',   // Màu 7
                'rgb(0, 204, 255)',   // Màu 8
                'rgb(102, 205, 170)', // Màu 9
                'rgb(255, 165, 0)',   // Màu 10
                'rgb(128, 0, 128)',   // Màu 11
                'rgb(34, 193, 195)'   // Màu 12
            ],
            hoverOffset: 4,
        },       
        ]
    };

    const chartDataDTTheoNgay = {
        labels: dataDTTheoNgay?.length ? dataDTTheoNgay.map(item => moment(item._id).format('DD/MM/YYYY')) : [],
        datasets: [{
            label: 'Doanh thu theo ngày',
            data: dataDTTheoNgay?.length ? dataDTTheoNgay.map(item => item.totalSales) : [],
            backgroundColor: [
                'rgb(255, 99, 132)',  // Màu 1
                'rgb(54, 162, 235)',  // Màu 2
                'rgb(255, 205, 86)',  // Màu 3
                'rgb(75, 192, 192)',  // Màu 4
                'rgb(153, 102, 255)', // Màu 5
                'rgb(255, 159, 64)',  // Màu 6
                'rgb(255, 99, 71)',   // Màu 7
                'rgb(0, 204, 255)',   // Màu 8
                'rgb(102, 205, 170)', // Màu 9
                'rgb(255, 165, 0)',   // Màu 10
                'rgb(128, 0, 128)',   // Màu 11
                'rgb(34, 193, 195)'   // Màu 12
            ],
            hoverOffset: 4,
        },       
        ]
    };
    
    const handleDateChange = (dates, dateStrings) => {
        console.log('Selected Dates:', dates); // Mảng các đối tượng ngày
        console.log('Formatted Date Strings:', dateStrings); // Mảng các chuỗi định dạng ngày
    
        setDates(dateStrings);
    };

    console.log("dataDT: ", dataDT);
    console.log("salesData: ", salesData);
    console.log("dates: ", dates);
    console.log("startDate, endDate: ", startDate, endDate);
    console.log("dataDTTheoNgay: ", dataDTTheoNgay);

    const totalTongDoanhThuTheoNgay = dataDTTheoNgay.reduce((acc, item) => acc + item.totalSales, 0);

    return (
        <div className="row">
            <div className="col-xl-3 col-sm-6 ">
                <div className="card">
                    <div className="card-body p-3">
                    <div className="row">
                        <div className="col-8">
                        <div className="numbers">
                            <p className="text-sm mb-0 text-uppercase font-weight-bold">Số người đang online</p>
                            <h6 style={{color: "blue"}} className="font-weight-bolder">
                            {onlineUsers} người đang online
                            </h6>
                            {/* <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">+3%</span>
                            since last week
                            </p> */}
                        </div>
                        </div>
                        <div className="col-4 text-end">
                        <div className="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                            <i className="ni ni-world text-lg opacity-10" aria-hidden="true" />
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-3 col-sm-6">
            <div className="card">
                <div className="card-body p-3">
                <div className="row">
                    <div className="col-8">
                    <div className="numbers">
                        <p className="text-sm mb-0 text-uppercase font-weight-bold">Số lượng đơn hàng khách đã đặt</p>
                        <h6 style={{color: "blue"}} className="font-weight-bolder">
                        {khongHuyDH} đơn hàng
                        </h6>
                        {/* <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">+5%</span> than last month
                        </p> */}
                    </div>
                    </div>
                    <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                        <i className="ni ni-cart text-lg opacity-10" aria-hidden="true" />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <div className="col-xl-3 col-sm-6">
            <div className="card">
                <div className="card-body p-3">
                <div className="row">
                    <div className="col-8">
                    <div className="numbers">
                        <p className="text-sm mb-0 text-uppercase font-weight-bold">Số lượng đơn hàng thành công</p>
                        <h6 style={{color: "blue"}} className="font-weight-bolder">
                        {thanhCongDH} đơn hàng 
                        </h6>
                        {/* <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">+5%</span> than last month
                        </p> */}
                    </div>
                    </div>
                    <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                        <i className="ni ni-cart text-lg opacity-10" aria-hidden="true" />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <div className="col-xl-3 col-sm-6">
            <div className="card">
                <div className="card-body p-3">
                <div className="row">
                    <div className="col-8">
                    <div className="numbers">
                        <p className="text-sm mb-0 text-uppercase font-weight-bold">Số lượng đơn hàng đã hủy</p>
                        <h6 style={{color: "blue"}} className="font-weight-bolder">
                        {daHuyDH} đơn hàng đã hủy
                        </h6>
                        {/* <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">+5%</span> than last month
                        </p> */}
                    </div>
                    </div>
                    <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                        <i className="ni ni-cart text-lg opacity-10" aria-hidden="true" />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>


            <div className="row mt-6">
                <div className="col-lg-12 mb-lg-0 mb-4">
                    <div className="card z-index-2 h-100">
                    <div className="card-header pb-0 pt-3 bg-transparent">
                        <h6 className="text-capitalize">Doanh Thu Theo Tháng</h6>                        
                    </div>
                    <div className="card-body p-3">
                        <div className="chart">                            
                        {/* <canvas id="chart-line" className="chart-canvas" height={300} /> */}
                        {salesData.length > 0 ? (
                            <Row style={{height: '400px'}}>
                                <Col span={24} style={{height: '400px', justifyItems: "flex-start", display: "flex"}}>                        
                                    <Pie 
                                    style={{justifyContent: "start", cursor: "pointer"}}
                                    data={chartData} 
                                    options={{
                                        responsive: true,  // Đảm bảo biểu đồ phản hồi theo kích thước màn hình
                                        plugins: {
                                            legend: {
                                                position: 'top',  // Vị trí của legend
                                                labels: {
                                                    font: {
                                                        size: 15  // Điều chỉnh kích thước font trong legend
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (tooltipItem) => {
                                                        console.log("tooltipItem: ",tooltipItem);                                                        
                                                        const sales = Math.round(tooltipItem.raw).toLocaleString(); // Doanh thu
                                                        const totalOrders = dataDT[tooltipItem.dataIndex]?.totalOrders || 0; // Số đơn hàng
                                                        return `Tổng doanh thu: ${sales} đ | Tổng có ${totalOrders} đơn hàng thành công`; // Hiển thị doanh thu và số đơn hàng                                                        
                                                    },
                                                },
                                                // Thay đổi kích thước font của label trong tooltip
                                                bodyFont: {
                                                    size: 14,  // Kích thước chữ trong tooltip
                                                },
                                                titleFont: {
                                                    size: 15,  // Kích thước chữ tiêu đề trong tooltip
                                                },
                                            },
                                        },
                                        maintainAspectRatio: false,  // Đảm bảo tỷ lệ không cố định
                                    }}
                                    width={170} height={170} />                 
                                </Col>                        
                            </Row>
                        ) : (
                            <p>Đang tải dữ liệu...</p>
                        )} 
                        </div>
                    </div>
                    </div>
                </div>

            </div>

            <div className="row mt-6">
                <div className="col-lg-12 mb-lg-0 mb-4">
                    <div className="card z-index-2 h-100">
                    <div className="card-header pb-0 pt-3 bg-transparent">
                        <h6 className="text-capitalize">Doanh Thu Theo Ngày</h6>                        
                    </div>
                    <div className="card-body p-3">
                        <div className="chart">                            
                        <RangePicker size="large" onChange={handleDateChange} format="DD/MM/YYYY" />
                            {totalTongDoanhThuTheoNgay > 0 ? <>
                                <span style={{marginLeft: "50px", fontSize: "20px", color: "navy"}}>Tổng doanh thu trong khoảng {startDate} đến {endDate} là: <span style={{color: "red"}}>{Math.round(totalTongDoanhThuTheoNgay).toLocaleString()}đ</span></span>
                            </> : <p style={{fontSize: "18px", marginTop: "30px", marginLeft: "30px"}}><IoWarningOutline size={50} style={{color: "orange"}} />  Chưa có doanh thu</p>}
                            <Row style={{height: '400px'}}>
                                <Col span={24} style={{height: '400px', justifyItems: "flex-start", display: "flex"}}>                        
                                    <Pie 
                                    style={{justifyContent: "start", cursor: "pointer"}}
                                    data={chartDataDTTheoNgay} 
                                    options={{
                                        responsive: true,  // Đảm bảo biểu đồ phản hồi theo kích thước màn hình
                                        plugins: {
                                            legend: {
                                                position: 'top',  // Vị trí của legend
                                                labels: {
                                                    font: {
                                                        size: 15  // Điều chỉnh kích thước font trong legend
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (tooltipItem) => {
                                                        console.log("tooltipItem theo ngày: ",tooltipItem);                                                        
                                                        const sales = Math.round(tooltipItem.raw).toLocaleString(); // Doanh thu
                                                        const totalOrders = dataDTTheoNgay[tooltipItem.dataIndex]?.totalOrders || 0; // Số đơn hàng
                                                        console.log("totalOrders theo ngày: ", totalOrders);
                                                        
                                                        return `Tổng doanh thu: ${sales} đ | Tổng có ${totalOrders} đơn hàng thành công`; // Hiển thị doanh thu và số đơn hàng                                                        
                                                    },
                                                },
                                                // Thay đổi kích thước font của label trong tooltip
                                                bodyFont: {
                                                    size: 14,  // Kích thước chữ trong tooltip
                                                },
                                                titleFont: {
                                                    size: 15,  // Kích thước chữ tiêu đề trong tooltip
                                                },
                                            },
                                        },
                                        maintainAspectRatio: false,  // Đảm bảo tỷ lệ không cố định
                                    }}
                                    width={170} height={170} />                 
                                </Col>                        
                            </Row>
                        </div>
                    </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default AdminPage