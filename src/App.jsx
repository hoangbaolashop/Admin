import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from "./pages/admin";
import LoginAdmin from "./components/Login/LoginAdmin";
import Products from "./pages/admin/products";
import KhachHangPage from "./pages/admin/khachHang";
import Category from "./pages/admin/category";
import HangSX from "./pages/admin/hangsx";
import Voucher from "./pages/admin/voucher";
import HistoryCart from "./pages/admin/historyCart";
import NhanVienPage from "./pages/admin/nhanvien";
import HopQua from "./pages/admin/hopQua";
import CauHoi from "./pages/admin/cauhoi";

export default function App() {


  const router = createBrowserRouter([
    {
      path: "/admin",
      element: 
        <ProtectedRoute>
          <LayoutAdmin />
        </ProtectedRoute>,
      errorElement: <NotFound />,

      children: [
        {
          index: true, 
          element: 
          <ProtectedRoute>
              <AdminPage />
          </ProtectedRoute>
          
        },   
        {
          path: "products",
          element: 
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        },         
        {
          path: "category",
          element: 
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        },
        {
          path: "hangsx",
          element: 
          <ProtectedRoute>
            <HangSX />
          </ProtectedRoute>
        },
        {
          path: "users",
          element: 
          <ProtectedRoute>
            <KhachHangPage />
          </ProtectedRoute>
        }, 
        {
          path: "nhanvien",
          element: 
          <ProtectedRoute>
            <NhanVienPage />
          </ProtectedRoute>
        }, 
        {
          path: "voucher",
          element: 
          <ProtectedRoute>
            <Voucher />
          </ProtectedRoute>
          
        }, 
        {
          path: "hopqua",
          element: 
          <ProtectedRoute>
            <HopQua />
          </ProtectedRoute>
          
        }, 
        {
          path: "cauhoi",
          element: 
          <ProtectedRoute>
            <CauHoi />
          </ProtectedRoute>
          
        },  
        {
          path: "historycart",
          element: 
          <ProtectedRoute>
            <HistoryCart />
          </ProtectedRoute>
          
        },     
      ],
    },

    {
      path: "/loginAdmin",
      element: <LoginAdmin />,
      errorElement: <div>404 not found</div>,
    },
    {
      path: "/registerAdmin",
      element: "component register",
      errorElement: <div>404 not found</div>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}