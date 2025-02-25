import '../../../public/LoginAdmin/fonts/material-icon/css/material-design-iconic-font.min.css'
import '../../../public/LoginAdmin/css/style.css'
import '../../../public/LoginAdmin/vendor/jquery/jquery.min.js'
import '../../../public/LoginAdmin/js/main.js'
import signupImage from '../../../public/LoginAdmin/images/signup-image.jpg'
import signinImage from '../../../public/LoginAdmin/images/signin-image.jpg'
import { useEffect, useState } from 'react'
import { Button, Checkbox, Col, Divider, Form, Input, message, notification, Radio, Row } from 'antd'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRightOutlined } from "@ant-design/icons";
import { callLogin, callRegister } from '../../services/loginAdminAPI.js'
import { useDispatch, useSelector } from 'react-redux'
import { doLoginAction } from '../../redux/accAdmin/accountSlice.js'

const LoginAdmin = () => {

    const [isSignIn, setIsSignIn] = useState(true);
    const [formLogin] = Form.useForm()
    const [formRegister] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.accountAdmin.isAuthenticated)
    console.log("isAuthenticated: ", isAuthenticated);
    

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Hàm để tạo mật khẩu ngẫu nhiên
    const generateRandomPassword = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    };

    const onFinishRegister = async (values) => {
        const {email, password, firstName, lastName, address, phone} = values
        console.log('Success:', email, password, firstName, lastName, address, phone);
        
        // Giả sử giá trị 'gender' là 'other', bạn có thể xử lý khác biệt ở đây
        // const genderText = values.gender === true ? 'Nam' : values.gender === false ? 'Nữ' : 'Bê Đê';
        // message.success(`Bạn vừa chọn giới tính là: ${genderText}`);

        setIsLoading(true)
        const res = await callRegister(email, password, firstName, lastName, address, phone)
        console.log("res: ", res);
        if(res.data){
            message.success(res.message)
            formRegister.resetFields()
            navigate("/loginAdmin")
        } else {
            notification.error({ 
                message: "Đăng ký không thành công!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLoading(false)
    }

    useEffect(() => {
        const rememberedAccountAdmin = localStorage.getItem("rememberedAccountAdmin");
        if (rememberedAccountAdmin) {
            const account = JSON.parse(rememberedAccountAdmin);
            console.log("JSON.parse(rememberedAccountAdmin): ",JSON.parse(rememberedAccountAdmin));
            
            formLogin.setFieldsValue({
                email: account.email,
                password: account.password,
                remember: true,
            });
            setRemember(true);
        }
    }, [formLogin]);

    const onFinish = async (values) => {
        console.log("kết quả values: ", values);
        const {email, password } = values

        setIsLoading(true)
        const res = await callLogin(email, password)
        console.log("res login: ", res);
        
        if(res.data) {
            localStorage.setItem("access_tokenAdmin", res.access_token)
            dispatch(doLoginAction(res.data))
            console.log("dispatch(doLoginAction(res.data)): ", dispatch(doLoginAction(res.data)));
            message.success("Đăng nhập thành công")

            if (remember) {
                // Nếu người dùng chọn "Ghi nhớ tài khoản", lưu thông tin vào localStorage
                localStorage.setItem("rememberedAccountAdmin", JSON.stringify({ email, password }));
            } else {
                // Nếu không chọn, xóa dữ liệu đã lưu (nếu có)
                localStorage.removeItem("rememberedAccountAdmin");
            }

            navigate("/admin")
            formLogin.resetFields()
            // handleLoginSuccess(res.access_token);
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLoading(false)
    }

    return (
        <>
            {isAuthenticated === false ?
                <div className="main">
                    {/* Sign in Form */}
                    {isSignIn ? (
                        <section className="sign-in">
                            <div className="container">
                                <div className="signin-content">
                                    <div className="signin-image">
                                        <figure><img src={signinImage} alt="sign in" /></figure>
                                        <a className="signup-image-link color-txt" onClick={() => setIsSignIn(false)}>Bấm vào đây để đăng ký tài khoản</a>
                                    </div>

                                    <div className="signin-form">
                                        <h2 className="form-title" >Đăng nhập</h2>
                                        {/* <form method="POST" className="register-form" id="login-form">
                                            <div className="form-group">
                                                <label htmlFor="your_name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                                <input type="text" name="your_name" id="your_name" placeholder="Your Name" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="your_pass"><i className="zmdi zmdi-lock"></i></label>
                                                <input type="password" name="your_pass" id="your_pass" placeholder="Password" />
                                            </div>
                                            <div className="form-group">
                                                <input type="checkbox" name="remember-me" id="remember-me" className="agree-term" />
                                                <label htmlFor="remember-me" className="label-agree-term"><span><span></span></span>Remember me</label>
                                            </div>
                                            <div className="form-group form-button">
                                                <input type="submit" name="signin" id="signin" className="form-submit" value="Log in" />
                                            </div>
                                        </form> */}
                                        <Form
                                            form={formLogin}
                                            className="register-form"
                                            id="login-form"
                                            layout="vertical"                                    
                                            onFinish={onFinish} 
                                        >
                                            <Form.Item
                                                // label="Email"                                        
                                                name="email"                                                
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                                    },
                                                    {
                                                        type: "email",
                                                        message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                                    },

                                                ]}
                                                hasFeedback
                                            >
                                                <Input placeholder="Nhập email của bạn" />
                                            </Form.Item>

                                            <Form.Item
                                                    // label="Password"
                                                    name="password"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Password không được để trống!',
                                                        },  
                                                        {
                                                            required: false,
                                                            pattern: new RegExp(/^(?!.*\s).{6,}$/),
                                                            message: 'Không được nhập có dấu cách, tối thiểu có 6 kí tự!',
                                                        },                                  
                        
                                                    ]}
                                                    hasFeedback
                                                >
                                                <Input.Password onKeyDown={(e) => {
                                                    console.log("check key: ", e.key);
                                                    if(e.key === 'Enter') formLogin.submit()
                                                }} placeholder="Nhập mật khẩu của bạn" />
                                            </Form.Item>                            

                                            <Form.Item >
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Button loading={isLoading} 
                                                            type="primary" 
                                                            onClick={() => formLogin.submit()}>
                                                        Đăng nhập 
                                                    </Button>
                                                    <Link to="/">Trở về trang chủ <ArrowRightOutlined /></Link>
                                                </div>
                                            </Form.Item>

                                            <Form.Item
                                                name="remember"
                                                valuePropName="checked"                                
                                            >
                                                <Checkbox
                                                    checked={remember}
                                                    onChange={(e) => setRemember(e.target.checked)}
                                                >Ghi nhớ tài khoản</Checkbox>
                                            </Form.Item>
                                        </Form>
                                        <Divider />

                                        <div className="social-login">
                                            <span className="social-label">Or login with</span>
                                            <ul className="socials">
                                                <li><a href="#"><i className="display-flex-center zmdi zmdi-facebook"></i></a></li>
                                                <li><a href="#"><i className="display-flex-center zmdi zmdi-twitter"></i></a></li>
                                                <li><a href="#"><i className="display-flex-center zmdi zmdi-google"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        // Sign up form
                        <section className="signup">
                            <div className="container">
                                <div className="signup-content">
                                    <div className="signup-form">
                                        {/* <h2 className="form-title">Sign up</h2> */}

                                        <Form      
                                            form={formRegister}                           
                                            initialValues={{
                                                remember: true,
                                            }}
                                            // layout='vertical'    
                                            onFinish={onFinishRegister}
                                            onFinishFailed={onFinishFailed}
                                            autoComplete="off"
                                        
                                        >
                                            <h3 style={{ textAlign: "center", color: "navy", textTransform: 'uppercase',  }}>Đăng ký tài khoản người dùng</h3>
                                            <Divider />

                                            <Row gutter={[20,20]}>
                                                <Col md={12} sm={12} xs={24}>
                                                    <Form.Item
                                                        labelCol={{span: 24}}
                                                        label="Họ"
                                                        name="lastName"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Vui lòng nhập đầy đủ thông tin!',
                                                            },
                                                            {
                                                                required: false,
                                                                pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                                                message: 'Không được nhập số!',
                                                            },
                                                        ]}
                                                        hasFeedback
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>

                                                <Col md={12} sm={12} xs={24}>
                                                    <Form.Item
                                                        labelCol={{span: 24}}
                                                        label="Tên"
                                                        name="firstName"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Vui lòng nhập đầy đủ thông tin!',
                                                            },
                                                            {
                                                                required: false,
                                                                pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                                                message: 'Không được nhập số!',
                                                            },
                                                        ]}
                                                        hasFeedback
                                                    >
                                                        <Input />
                                                    </Form.Item>                            
                                                </Col>
                                            </Row>                    

                                            <Row gutter={[20,20]}>
                                                <Col md={12} sm={12} xs={24}>
                                                    <Form.Item
                                                        labelCol={{span: 24}}
                                                        label="Email"
                                                        name="email"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Vui lòng nhập đầy đủ thông tin!',
                                                            },
                                                            {
                                                                type: "email",
                                                                message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                                            },
                                                        ]}
                                                        hasFeedback
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>

                                                <Col md={12} sm={12} xs={24}>
                                                    <Form.Item
                                                        labelCol={{span: 24}}
                                                        label="Password"
                                                        name="password"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Vui lòng nhập đầy đủ thông tin!',
                                                            },
                                                            {
                                                                required: false,
                                                                pattern: new RegExp(/^(?!.*\s).{6,}$/),
                                                                message: 'Không được nhập có dấu cách, tối thiểu có 6 kí tự!',
                                                            },
                                                        ]}
                                                        hasFeedback
                                                    >
                                                        <Input.Password />
                                                    </Form.Item>
                                                </Col>
                                            </Row>                             

                                            <Row gutter={[20,20]}>
                                                <Col md={12} sm={12} xs={24}>
                                                    <Form.Item
                                                        labelCol={{span: 24}}
                                                        label="Địa chỉ"
                                                        name="address"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Vui lòng nhập đầy đủ thông tin!',
                                                            },                                    
                                                        ]}
                                                        hasFeedback
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>

                                                <Col md={12} sm={12} xs={24}>
                                                    <Form.Item
                                                        labelCol={{span: 24}}
                                                        label="Số Điện Thoại"
                                                        name="phone"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Vui lòng nhập đầy đủ thông tin!',
                                                            },
                                                            {
                                                                pattern: /^0\d{9}$/,
                                                                message: 'Số điện thoại phải có 10 chữ số và bẳt đầu bằng số 0, không chứa kí tự!',
                                                            },
                                                        ]}
                                                        hasFeedback
                                                    >
                                                        <Input />
                                                    </Form.Item>                          
                                                </Col>
                                            </Row>

                                            {/* <Row>
                                                <Col md={24}>
                                                    <Form.Item
                                                        label="Giới tính"
                                                        name="gender"
                                                        rules={[{ required: true, message: 'Vui lòng chọn một tùy chọn!' }]}
                                                    >
                                                    <Radio.Group style={{marginRight: "30px"}}>
                                                        <Radio value={true}>Nam</Radio>
                                                        <Radio value={false}>Nữ</Radio>
                                                    </Radio.Group>
                                                    </Form.Item>
                                                </Col>
                                            </Row>      */}

                                            
                                            <Row>
                                                <Col span={12}>
                                                    <Form.Item>
                                                        <Button type="primary" onClick={() => formRegister.submit()} loading={isLoading}> Đăng ký tài khoản</Button>                                                
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item>
                                                        <Button type="primary" danger onClick={() => {
                                                            console.log("check form: ", formRegister.getFieldsValue());
                                                            // form.getFieldsValue()
                                                            const randomPassword = generateRandomPassword(6); // Sinh mật khẩu với độ dài 10 ký tự
                                                            formRegister.setFieldsValue({
                                                                password: randomPassword,
                                                            })
                                                        }}>Tự tạo mật khẩu</Button>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            

                                        </Form> 

                                        {/* <form method="POST" className="register-form" id="register-form">
                                            <div className="form-group">
                                                <label htmlFor="name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                                <input type="text" name="name" id="name" placeholder="Your Name" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                                                <input type="email" name="email" id="email" placeholder="Your Email" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="pass"><i className="zmdi zmdi-lock"></i></label>
                                                <input type="password" name="pass" id="pass" placeholder="Password" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="re_pass"><i className="zmdi zmdi-lock-outline"></i></label>
                                                <input type="password" name="re_pass" id="re_pass" placeholder="Repeat your password" />
                                            </div>
                                            <div className="form-group">
                                                <input type="checkbox" name="agree-term" id="agree-term" className="agree-term" />
                                                <label htmlFor="agree-term" className="label-agree-term"><span><span></span></span>I agree all statements in <a href="#" className="term-service">Terms of service</a></label>
                                            </div>
                                            <div className="form-group form-button">
                                                <input type="submit" name="signup" id="signup" className="form-submit" value="Register" />
                                            </div>
                                        </form> */}
                                    </div>
                                    <div className="signup-image">
                                        <figure><img src={signupImage} alt="sign up" /></figure>
                                        <a className="signup-image-link color-txt" onClick={() => setIsSignIn(true)}>Bấm vào đây để đăng nhập</a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            :
                <Navigate to='/admin' replace />
            } 

            
        </>
    );
};
export default LoginAdmin