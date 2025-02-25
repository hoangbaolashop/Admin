import '../../../public/DashBoard/assets/css/fonts.css'
import '../../../public/DashBoard/assets/css/argon-dashboard.css'
import MenuLeft from './Menu/Menu';
import NavbarTop from './Navbar/NavbarTop';
import Footer from './Footer/Footer';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';


const LayoutAdmin = () => {

    return (
        <div>
          <div className="min-height-300 bg-dark position-absolute w-100" />
            <MenuLeft />

            <main className="main-content position-relative border-radius-lg ">
                {/* Navbar */}
                {/* <NavbarTop /> */}
                {/* End Navbar */}
                            
                <div className="container-fluid py-4">            
                    <Outlet />                     
                </div>
                <Footer />
            </main>         
        </div>
    );
}
export default LayoutAdmin