import axios from "../utils/axios-customize"

export const fetchAllAccKH= (query) => {
    const URL_BACKEND = `/api/acckh/get-kh?${query}`    
    return axios.get(URL_BACKEND)
}

export const deleteAccKH= (id) => {
    return axios.delete(`/api/acckh/delete-kh/${id}`)
}

export const updateAccKH= (id, fullName, IdVoucher, quayMayManCount, hangTV) => {
    return axios.put('/api/acckh/update-kh', {
        id, fullName, IdVoucher, quayMayManCount, hangTV
    })
}

export const khoaAccKH= (id, isActive) => {
    return axios.put('/api/acckh/khoa-kh', {
        id, isActive
    })
}