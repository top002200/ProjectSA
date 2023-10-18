import React, { useState } from 'react';
import {
  Col,
  Card,
  Space,
  Button,
  Form,
  Input,
  message,
  Divider,
} from "antd";
import "./style.css";
import { Link } from "react-router-dom";
import { UsersInterface } from "../../../interfaces/IUser";
import { UserLogin } from "../../../services/https/user";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
const { TextArea } = Input;


function LoginUserUI() {
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: UsersInterface) => {
    try {
      const response = await UserLogin(values);
      console.log(response);

      if ('accessToken' in response) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('id', JSON.stringify(response.id));
        localStorage.setItem('result', response.result);
        console.log(localStorage.getItem('id'));
        messageApi.success("เข้าสู่ระบบสำเร็จ");
        setTimeout(() => {
          window.location.href = "/profile/user";
        }, 1500);
      }
    } catch (error) {
      messageApi.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }

  };

  const [size, setSize] = useState<SizeType>('large'); // default is 'middle'

  return (
    <>
      {contextHolder}
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div className='img-back' style={{ display: "grid", placeItems: "center", height: "100vh" }}>
          <text style={{
            fontSize: '60px', marginLeft: '0px',
            marginTop: '0px',
            fontWeight: 'bolder', color: 'white'
          }}>
            <span style={{ color: '#ff7518' }}>JO</span>
            <span>B</span>
            <span style={{ color: '#ff7518' }}>JO</span>
            <span>B</span>
          </text>
          <Space direction="vertical" size="middle">

            <div style={{ marginTop: '-400px' }}>
              <Card style={{ height: "130px", marginTop: '0px', marginBottom: "-30px", }}>
                <div className="label" style={{ marginLeft: "30px", marginRight: "30px" }}>
                  <p className="div">
                    <span className="text-wrapper">เข้าสู่ระบบ</span>
                    <span className="span">&nbsp;</span>
                    <span className="text-wrapper-2">สำหรับผู้หางาน</span>
                    <span className="space"></span>
                    <Button className="custom-button" danger>เข้าสู่ระบบ สำหรับผู้ประกอบการ</Button>
                  </p>
                </div>
              </Card>
              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Card size="small" style={{ height: "220px" }}>
                  <div style={{ marginBottom: "10px", marginTop: "20px", marginLeft: "30px", marginRight: "30px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper"
                        label="อีเมล"
                        name="user_email"
                        rules={[
                          {
                            type: "email",
                            message: "รูปแบบอีเมลไม่ถูกต้อง !",
                          },
                          {
                            required: true,
                            message: "กรุณากรอก !",
                          },
                        ]}
                      >
                        <Input/>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper"
                        label="รหัสผ่าน"
                        name="user_pass"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอก !",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Divider />
                  </div>
                </Card>
                <Card style={{ height: "85px", marginTop: "-15px", }}>
                  <div className="label" style={{ marginLeft: "18px", marginRight: "30px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Button htmlType="submit" className='custom-button2' type="primary" size={size}>
                        เข้าสู่ระบบ
                      </Button>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span className="text-wrapper-2">หรือ</span>
                      <span>&nbsp;&nbsp;</span>
                      <Link to='/register/user' className='custom-button3' type="link">
                        ลงทะเบียน
                      </Link>
                      <span>&nbsp;&nbsp;</span>
                      <span className="text-wrapper-2">ด้วยอีเมล?</span>
                    </Col>
                  </div>

                </Card>
              </Form>
            </div>

          </Space>
        </div>
      </Col>

    </>
  );
};


export default LoginUserUI;

