import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Collapse, Descriptions, Drawer, Tag } from "antd";
import moment from "moment";
const ViewDetail = (props) => {

    const {
        openViewSP, setOpenViewSP, dataViewSP, setDataViewSP
    } = props

    const items = [
        {
            key: 'Image',
            span: 3,
            label: 'Image',
            children: <Avatar 
                        style={{ width: 150, height: 140, objectFit: 'cover', borderRadius: "15%", border: "2px solid navy" }}
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataViewSP?.Image}`}
                        shape="square" size={80} icon={<UserOutlined />} />,
        },
        {
            key: 'sizes',
            label: 'Sizes',
            children: 
                <div>
                    {dataViewSP?.sizes.map((item, index) => (
                        <p key={index}>
                            <span style={{color: "navy"}}>Size: </span> 
                            <span style={{color: "red"}}>{item.size}</span> - &nbsp;
                            <span>Số lượng: </span>
                            <span style={{color: "red"}}>{item.quantity}</span>
                            <span style={{color: "navy"}}> sản phẩm</span> -  &nbsp;
                            <span>Đơn giá: </span>
                            <span style={{color: "red"}}>{item.price.toLocaleString()} </span> 
                            <span style={{color: "navy"}}>VNĐ</span>
                        </p>
                    ))}
                </div>
            ,
            span: 3,
        },
        {
            key: 'IdHangSX',
            label: 'Hãng sản phẩm',
            children: <Badge status="processing" text={`${dataViewSP?.IdHangSX.TenHangSX}`} />,
            span: 1.5
        },
        {
            key: 'IdLoaiSP',
            label: 'Loại sản phẩm',
            children: 
                <ul>
                    {dataViewSP?.IdLoaiSP.map((item, index) => (
                        <li>
                            <p key={index} style={{color: "navy"}}>{item.TenLoaiSP}</p>
                        </li>
                    ))}
                </ul>,
            span: 2
        },
        {
            key: 'ImageSlider',
            label: 'Ảnh Slider',
            children: 
            <>
               {dataViewSP?.ImageSlider.map((item, index) => (
                    <Avatar 
                    style={{ objectFit: 'cover', borderRadius: "10%", border: "1px solid green", margin: "10px 10px 0 15px" }}
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item}`}
                    shape="square" size={100} icon={<UserOutlined />} />
                ))} 
            </>
            ,
            span: 3
        },
                
        {
          key: 'SoLuongBan',
          label: 'Đã bán',
          children: `${dataViewSP?.SoLuongBan} sp`,
        },
        {
            key: 'SoLuongTon',
            label: 'Tồn kho',
            children: (
                <>
                  {dataViewSP?.SoLuongTon === 0 ? (
                    <Tag color="red">Hết hàng</Tag>
                  ) : (
                    <Tag color="blue">Còn hàng: {dataViewSP?.SoLuongTon}</Tag>
                  )}
                </>
            ),
            // children: `${dataViewSP?.SoLuongTon} sp`,
          },
        {
          key: 'GiamGiaSP',
          label: 'Giảm giá',
          children: <p style={{color: "red"}}>{dataViewSP?.GiamGiaSP}%</p>,
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            children: (
                <>
                {moment(dataViewSP?.createdAt).format('DD/MM/YYYY')}
                {/* <br /> */} &nbsp; &nbsp;
                {moment(dataViewSP?.createdAt).format('HH:mm:ss')}
                </>
            ),
            span: 1.5,
        },
        {
            key: 'updatedAt',
            label: 'Ngày sửa',
            children: (
                <>
                {moment(dataViewSP?.updatedAt).format('DD/MM/YYYY')}
                {/* <br /> */} &nbsp; &nbsp;
                {moment(dataViewSP?.updatedAt).format('HH:mm:ss')}
                </>
            ),
            span: 1.8
        },
    ];

    const onClose = () => {
        setOpenViewSP(false);
    };

    const mota = `${dataViewSP?.MoTa}`
    const motact = `${dataViewSP?.MoTaChiTiet}`

    return (
        <Drawer
            // title={` ${dataViewSP.TenSP} ${dataViewSP.GiamGiaSP === "0" ? '' : `(Giảm giá: ${dataViewSP.GiamGiaSP}%)`} `}
            title={`${dataViewSP?.TenSP} ${isNaN(parseFloat(dataViewSP?.GiamGiaSP)) || parseFloat(dataViewSP?.GiamGiaSP) <= 0 ? '' : ` ---- (SALE: ${dataViewSP?.GiamGiaSP}%)`}`}
            placement="right"
            size={'large'}
            onClose={onClose}
            open={openViewSP}
        >
            <Descriptions title="Xem thông tin chi tiết" bordered items={items} />

            <Collapse
                style={{marginTop: "30px"}}
                size="large"
                items={[
                    {
                    key: 'mota',
                    label: 'Xem mô tả',
                    children: <div className="truncate"  dangerouslySetInnerHTML={{ __html: mota }} />,
                    },
                ]}
            />

            <Collapse
                style={{marginTop: "30px"}}
                size="large"
                items={[
                    {
                    key: 'motact',
                    label: 'Xem mô tả chi tiết',
                    children: <div className="truncate"  dangerouslySetInnerHTML={{ __html: motact }} />,
                    },
                ]}
            />
      </Drawer>
    )
}
export default ViewDetail