import axios from "../utils/axios-customize"

export const fetchAllHopQua = (query) => {
    const URL_BACKEND = `/api/hopqua/get-hop-qua?${query}`    
    return axios.get(URL_BACKEND)
}

export const createHopQua = (tenHopQua, messageHopQua, IdVoucher, IdKH) => {
    return axios.post('/api/hopqua/create-hop-qua', {
        tenHopQua, messageHopQua, IdVoucher, IdKH
    })
}

export const deleteHopQua = (id) => {
    return axios.delete(`/api/hopqua/delete-hop-qua/${id}`)
}

export const updateHopQua = (_id, tenHopQua, messageHopQua, IdVoucher, IdKH) => {
    return axios.put('/api/hopqua/update-hop-qua', {
        _id, tenHopQua, messageHopQua, IdVoucher, IdKH
    })
}