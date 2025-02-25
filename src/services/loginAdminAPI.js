import axios from "../utils/axios-customize"

export const callRegister = (email, password, firstName, lastName, address, phone) => {
    const URL_BACKEND = '/api/accadmin/register-admin'
    const data = {
        email, password, firstName, lastName, address, phone
    }
    return axios.post(URL_BACKEND, data)
}

export const callLogin = (email, password) => {
    const URL_BACKEND = '/api/accadmin/login-admin'
    const data = {
        email, password
    }
    return axios.post(URL_BACKEND, data)
}

export const callLogout = () => {
    const URL_BACKEND = '/api/accadmin/logout-admin'    
    return axios.post(URL_BACKEND)
}

export const fetchAllAccAdmin= (query) => {
    const URL_BACKEND = `/api/accadmin/get-admin?${query}`    
    return axios.get(URL_BACKEND)
}

export const updateAccAdmin= (id, roleId, lastName, firstName) => {
    return axios.put('/api/accadmin/update-admin', {
        id, roleId, lastName, firstName
    })
}

export const khoaAccAdmin= (id, isActive) => {
    return axios.put('/api/accadmin/khoa-admin', {
        id, isActive
    })
}

export const deleteAccAdmin= (id) => {
    return axios.delete(`/api/accadmin/delete-admin/${id}`)
}

export const fetchAllRole= () => {
    const URL_BACKEND = `/api/accadmin/get-role`    
    return axios.get(URL_BACKEND)
}