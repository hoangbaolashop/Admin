import { Link, useLocation, useNavigate } from 'react-router-dom'
import imgLogo from '/DashBoard/assets/img/logo-ct-dark.png'
import { AiFillProduct } from "react-icons/ai";
import { IoGift, IoHome, IoLogoAppleAppstore } from "react-icons/io5";
import { FaBoxOpen, FaCartPlus, FaQuestionCircle, FaUserCheck } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../../services/loginAdminAPI';
import { Dropdown, Menu, message } from 'antd';
import { doLogoutAction } from '../../../redux/accAdmin/accountSlice';
import { RiDiscountPercentFill } from 'react-icons/ri';
import { FaUserGear } from "react-icons/fa6";
import { SiThunderstore } from "react-icons/si";
import { MdAdminPanelSettings, MdCategory, MdOutlineCategory } from 'react-icons/md';


const MenuLeft = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();
    const accName = useSelector(state => state.accountAdmin)
    console.log("accName: ", accName);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = async () => {
        try {
            const res = await callLogout();
            localStorage.removeItem('access_tokenAdmin');

            if (res) {
                message.success("Đăng xuất thành công!");
                dispatch(doLogoutAction())
                navigate("/loginAdmin");
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi đăng xuất', error);
            message.error("Đăng xuất không thành công!");
        }
    }

    return (
        <aside className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 " id="sidenav-main">
            <div className="sidenav-header">
              <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav" />
              <a className="navbar-brand m-0" href="/admin" target="_blank">
                <img src={imgLogo} width="26px" height="26px" className="navbar-brand-img h-100" alt="main_logo" /> &nbsp;
                <span className="ms-1 font-weight-bold text-danger">Shop NA KT</span>
              </a>
            </div>
            <hr className="horizontal dark mt-0" />
            <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin')}`} onClick={() => navigate('/admin')}>
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-tv-2 text-dark text-sm opacity-10" />
                    </div> */}
                    <IoHome size={18} style={{color: "blueviolet"}} />  &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Trang chủ Admin</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/products')}`} onClick={() => navigate('/admin/products')}>                    
                    <FaBoxOpen size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Sản phẩm</span>
                  </a>
                   {/* <Link style={{fontSize: "17px"}} to={"/admin/products"}>Sản phẩm</Link> */}
                </li>               
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/category')}`} onClick={() => navigate('/admin/category')}>                    
                    <MdCategory size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Loại Sản Phẩm</span>
                  </a>               
                </li>
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/hangsx')}`} onClick={() => navigate('/admin/hangsx')}>                    
                    <AiFillProduct size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Hãng Sản Xuất</span>
                  </a>               
                </li>
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/historycart')}`} onClick={() => navigate('/admin/historycart')}>
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-credit-card text-dark text-sm opacity-10" />
                    </div> */}
                    <FaCartPlus size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Lịch sử đơn hàng</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/voucher')}`} onClick={() => navigate('/admin/voucher')}>
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-credit-card text-dark text-sm opacity-10" />
                    </div> */}
                    <RiDiscountPercentFill size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Mã giảm giá</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/users')}`} onClick={() => navigate('/admin/users')}>
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-credit-card text-dark text-sm opacity-10" />
                    </div> */}
                    <FaUserCheck size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Khách hàng</span>
                  </a>
                </li>  
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/nhanvien')}`} onClick={() => navigate('/admin/nhanvien')}>
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-credit-card text-dark text-sm opacity-10" />
                    </div> */}
                    <FaUserGear size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Nhân viên</span>
                  </a>
                </li>  
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/hopqua')}`} onClick={() => navigate('/admin/hopqua')}>
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-credit-card text-dark text-sm opacity-10" />
                    </div> */}
                    <IoGift size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Quà quay số</span>
                  </a>
                </li>     
                <li className="nav-item">
                  <a className={`nav-link ngon-tay ${isActive('/admin/cauhoi')}`} onClick={() => navigate('/admin/cauhoi')}>
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-credit-card text-dark text-sm opacity-10" />
                    </div> */}
                    <FaQuestionCircle size={18} style={{color: "blueviolet"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Câu hỏi</span>
                  </a>
                </li>                             
                
                <li className="nav-item mt-3">
                  <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Account Admin</h6>
                </li>
                <li className="nav-item">
                  <a className="nav-link ngon-tay " href="../pages/profile.html">
                  <MdAdminPanelSettings style={{color: "blueviolet"}} size={22} />&nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1">Xin chào: <span className='text-primary'>{accName.user.lastName} {accName.user.firstName}</span></span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ngon-tay " href="../pages/profile.html">
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-single-02 text-dark text-sm opacity-10" />
                    </div> */}
                    <IoLogoAppleAppstore size={22} style={{color: "green"}} /> &nbsp;&nbsp;&nbsp;
                    <a href="https://shopbandodientu.dokhactu.site/" target='_blank'>
                    <span className="nav-link-text ms-1" style={{color: "green"}}>Đi tới trang chủ bán hàng </span>
                    </a>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ngon-tay " onClick={() => handleLogout()}>
                    {/* <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                      <i className="ni ni-single-copy-04 text-dark text-sm opacity-10" />
                    </div> */}
                    <IoLogOut size={22} style={{color: "red"}} /> &nbsp;&nbsp;&nbsp;
                    <span className="nav-link-text ms-1 text-danger">Đăng xuất</span>
                  </a>
                </li>                
              </ul>
            </div>            
          </aside>
    )
}
export default MenuLeft