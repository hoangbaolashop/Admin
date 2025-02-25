import { Input, Space } from 'antd';
import { useState } from 'react';
const { Search } = Input;

const NavbarTop = (props) => {

    const {
        title, placeholder,
        searchTheoName,
    } = props

    const [searchValue, setSearchValue] = useState('');
    let searchTimeout; // Định nghĩa biến bên ngoài

    const onSearch = (value) => {
        console.log("Giá trị tìm kiếm:", value); // Thêm log này            
        searchTheoName(value || '');        
    };

    const handleSearchChange = (value) => {
        // setSearchValue(value);
        
        // Hủy timeout trước đó nếu có
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Tạo timeout mới
        searchTimeout = setTimeout(() => {
            onSearch(value); // Gọi hàm tìm kiếm
        }, 300); // Độ trễ 300ms
    };


    return (
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-2 shadow-none border-radius-xl " id="navbarBlur" data-scroll="false">
            <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-5 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm"><a className="opacity-5 text-white" href="javascript:;">Pages</a></li>
                <li className="breadcrumb-item text-sm text-white active" aria-current="page">{title}</li>
                </ol>
                {/* <h6 className="font-weight-bolder text-white mb-0">Home</h6> */}
            </nav>
            <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" style={{padding: "15px"}} id="navbar">
                <div className="ms-md-auto pe-md-5 d-flex align-items-center">
                <div className="input-group">
                    {/* <span className="input-group-text text-body"><i className="fas fa-search" aria-hidden="true" /></span> */}
                    {/* <input type="text" className="form-control" placeholder={placeholder} /> */}
                </div>
                    <Search 
                        style={{width: "600px"}}
                        size='large'
                        placeholder={placeholder} 
                        onChange={(e) => handleSearchChange(e.target.value)} // Gọi hàm xử lý thay đổi
                        onSearch={onSearch} 
                        enterButton 
                    />
                </div>               
            </div>
            </div>
        </nav>
    )
}
export default NavbarTop