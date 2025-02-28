import axios from "../utils/axios-customize"

export const fetchAllOrderHistory= (query) => {
    const URL_BACKEND = `/api/order/find-all-history-order?${query}`    
    return axios.get(URL_BACKEND)
}

export const deleteAOrderHistory= (id) => {
    const URL_BACKEND = `/api/order/delete-history-order/${id}`    
    return axios.delete(URL_BACKEND)
}

export const updateOrder= (_id, TinhTrangDonHang, TinhTrangThanhToan, urlTTGH) => {
    const URL_BACKEND = `/api/order/update-order`    
    let data = {
        _id, TinhTrangDonHang, TinhTrangThanhToan, urlTTGH
    }
    return axios.put(URL_BACKEND, data)
}

export const fetchDoanhThu = () => {
    const URL_BACKEND = `/api/order/sales-by-month`    
    return axios.get(URL_BACKEND)
}

export const fetchDoanhThuTheoNgay = (startDate, endDate) => {
    const URL_BACKEND = `/api/order/thong-ke-theo-ngay` 
    let data = {
        startDate, endDate
    }   
    return axios.post(URL_BACKEND, data)
}