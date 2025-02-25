import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";
import { Button } from "antd";
import NotPermittedKoCoQuyen from "./NotPermittedKoCoQuyen";

const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.accountAdmin.user)
    const userRole = user?.roleId;
    const navigate = useNavigate();

    // if (isAdminRoute ) {  // admin
    //     return (<>{props.children}</>)
    // } 
    if (userRole === '6729102ad9b0db6a6b5ca832') {
        // Admin có quyền truy cập tất cả các route
        return <>{props.children}</>;
    } 

    // Nếu là nhân viên (nhanvien), chỉ cho phép vào một số route nhất định
    if (userRole === '67291039d9b0db6a6b5ca833') {
        // Các trang mà nhân viên có quyền truy cập
        const allowedRoutes = ['/admin/products', '/admin/historycart', '/admin']; 

        if (allowedRoutes.includes(window.location.pathname)) {
            return <>{props.children}</>;
        } else {
            // Không cho phép vào các trang khác
            return <>
            <NotPermittedKoCoQuyen />
            </>;
        }
    }

    return <NotPermitted />;
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.accountAdmin.isAuthenticated)
    console.log("isAuthenticated: ",isAuthenticated);
    

    if (!isAuthenticated) {
        return <Navigate to='/loginAdmin' replace />;
    }

    // If authenticated, check role-based access
    return <RoleBaseRoute>{props.children}</RoleBaseRoute>;
}

export default ProtectedRoute;

