import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Divider, Drawer, Row } from "antd"
import { useState } from "react";
import moment from 'moment-timezone';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaFileExport } from "react-icons/fa";

const DrawerOrder = (props) => {

    const {
        openViewDetailOrder, setOpenViewDetailOrder, dataDetailOrder, setDataDetailOrder
    } = props

    const [placement, setPlacement] = useState('right');
    
    const onClose = () => {
        setOpenViewDetailOrder(false);
        setDataDetailOrder(null);
    };

    console.log("dataDetailOrder: ", dataDetailOrder);
    const exportToPDF = () => {
        // Make sure the content you want to capture has a valid reference
        const drawerContent = document.getElementById("drawer-content");
      
        // Check if the element exists
        if (!drawerContent) {
          console.error("Drawer content not found!");
          return;
        }
      
        // Use html2canvas to capture the content as an image
        html2canvas(drawerContent, {
          useCORS: true, // This is for handling cross-origin images (if any)
          allowTaint: true, // Allow tainted canvas for some cases
        }).then((canvas) => {
          // Initialize jsPDF
          const pdf = new jsPDF();
      
          // Convert the canvas to an image and add it to the PDF
          const imgData = canvas.toDataURL("image/png");
      
          // Add the image to the PDF at position (10, 10)
          pdf.addImage(imgData, "PNG", 10, 10);
      
          // Save the generated PDF with a file name
          pdf.save(`Order-${dataDetailOrder?._id.slice(-6)}.pdf`);
        }).catch((error) => {
          console.error("Error while capturing the content:", error);
        });
    };
    
   
  return (
    <Drawer
        title={`Chi tiết đơn hàng #${dataDetailOrder?._id.slice(-6)} -- ngày đặt: ${moment(dataDetailOrder?.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY (HH:mm:ss)')}`}
        placement={placement}
        closable={false}
        onClose={onClose}
        width={600}
        open={openViewDetailOrder}
        key={placement}
      >
        <div style={{textAlign: "center", width: "100%"}}>
            <Button style={{width: "100%"}} icon={<FaFileExport />} onClick={exportToPDF} size="large">Export PDF</Button>
        </div>
        <br/>
        <div id="drawer-content"> 
        <Row gutter={[20,15]}>
            <Col span={24} style={{textAlign: "center"}}>
                <span style={{fontSize: "18px"}}>Họ và tên khách hàng: <span style={{color: "navy"}}>{dataDetailOrder?.lastName} {dataDetailOrder?.firstName}</span></span> <br/>
                <span style={{fontSize: "18px"}}>Số điện thoại nhận hàng: <span style={{color: "navy"}}>{dataDetailOrder?.phone}</span></span> <br/>
                <span style={{fontSize: "18px"}}>Địa chỉ giao hàng: <span style={{color: "navy"}}>{dataDetailOrder?.address}</span></span> <br/>
                <span style={{fontSize: "18px"}}>Ngày đặt: <span style={{color: "navy"}}>{moment(dataDetailOrder?.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY (HH:mm:ss)')}</span></span> <br/>
            </Col>
        </Row>
        <br/>
        <h4 style={{textAlign: "center", color: "green"}}>THÔNG TIN CHI TIẾT SẢN PHẨM ĐÃ ĐẶT</h4>
        {/* <Divider/> */}
        <br/>
        {dataDetailOrder?.products?.map(item => {
            return (
                <>                
                <Row gutter={[20,15]}>
                    <Col span={24} md={24} style={{display: "flex"}}>
                        <Col span={4}>
                            <Avatar 
                            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item._idSP.Image}`} 
                            shape="square" size={100} icon={<UserOutlined />} />
                        </Col>
                        <Col span={20}>
                            <div style={{padding: "8px 25px", fontSize: "18px"}}>
                                <strong>{item._idSP.TenSP}</strong>
                                <p>Số lượng đặt: <span style={{color: "navy"}}>{item.quantity}</span> --- Tổng tiền: <span style={{color: "red"}}>{Math.round(item.price).toLocaleString()} VNĐ</span></p>
                                <p>Cấu hình: <span style={{color: "navy"}}>{item.size}</span></p>
                            </div>
                        </Col>
                    </Col>
                </Row>
                <Divider/>
                </>
            )
        })}  
        {dataDetailOrder?.TrangThaiHuyDon === "Đã Hủy" ? <>
            <h4 style={{textAlign: "center", color: "red"}}>ĐƠN HÀNG NÀY ĐÃ HỦY</h4>
        </> : <>
            <h4 style={{textAlign: "center", color: "green"}}>TỔNG TIỀN KHÁCH CẦN TRẢ</h4>
            <Row gutter={[20,15]}>
                <Col span={24}>
                    <div style={{textAlign: "center"}}>
                        <p style={{fontSize: "18px"}}>Tổng số sản phẩm: <span style={{color: "navy"}}>{dataDetailOrder?.tongSoLuong}</span></p>
                        <p style={{fontSize: "18px"}}>Tổng tiền: <span style={{color: "navy"}}>{Math.round(dataDetailOrder?.thanhTien).toLocaleString()}đ</span></p>
                        <p style={{fontSize: "18px"}}>Giảm giá: <span style={{color: "red"}}>{Math.round(dataDetailOrder?.soTienGiamGia).toLocaleString()}đ</span></p>
                        <p style={{fontSize: "18px"}}>Cần thanh toán: <span style={{color: "red"}}>{Math.round(dataDetailOrder?.soTienCanThanhToan).toLocaleString()}đ</span></p>
                    </div>
                </Col>
            </Row>                
        </>}
        </div>
        
    </Drawer>
  )
}
export default DrawerOrder