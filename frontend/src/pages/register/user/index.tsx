import React, { useEffect, useState } from 'react';
import {
  Col,
  Card,
  Space,
  Button,
  Form,
  Input,
  message,
  Divider,
  Row,
  Layout,
  Select,
} from "antd";
import {
  AuditOutlined,
  UserOutlined,
  PieChartOutlined,
  StockOutlined,
  DownOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "./style.css";
import { Link, useNavigate, } from "react-router-dom";
import { UsersInterface } from "../../../interfaces/IUser";
import { CreateUser } from "../../../services/https/user";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
const { TextArea } = Input;

function RegisterUserUI() {
  // const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const userPassword = form.getFieldValue('user_pass');
    const confirmPassword = form.getFieldValue('confirm_password');

    if (userPassword !== confirmPassword) {
      setPasswordError('รหัสผ่านไม่ตรงกัน');
    } else {
      setPasswordError('');
    }
  }, [form]);

  const onFinish = async (values: UsersInterface) => {
    try {
      const res = await CreateUser(values);
      if (res.status) {
        messageApi.success("ลงทะเบียนสำเร็จ");

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        messageApi.error(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [size, setSize] = useState<SizeType>('large'); // default is 'middle'

  return (
    <>
      {/* <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div className="demo-logo" />
    </Header> */}
      {contextHolder}
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div className='img-back' style={{ display: "grid", placeItems: "center", height: "100vh" }}>
          <text style={{
            fontSize: '60px', marginLeft: '0px',
            marginTop: '20px',
            fontWeight: 'bolder', color: 'white'
          }}>
            <span style={{ color: '#ff7518' }}>JO</span>
            <span>B</span>
            <span style={{ color: '#ff7518' }}>JO</span>
            <span>B</span>
          </text>
          <Space direction="vertical" size="middle">

            <div style={{ marginTop: '-140px' }}>
              <Card style={{ height: "130px", marginBottom: "-30px", }}>
                <div className="label" style={{ marginLeft: "30px", marginRight: "30px" }}>
                  <p className="div">
                    {/* <span className="space2"></span> */}
                    <span className="text-wrapper">ลงทะเบียน</span>
                    <span className="span">&nbsp;</span>
                    <span className="text-wrapper-2">สำหรับผู้หางาน</span>
                    <span className="space"></span>
                    <Button className="custom-button" danger>ลงทะเบียน สำหรับผู้ประกอบการ</Button>
                    {/* <span className="space2"></span> */}
                  </p>
                  {/* <p className="image">
                  <br />
                  <span className="space2"></span>
                  <span className="sp">คำนำหน้า</span>
                  <span className="space3"></span>
                  <span>ชื่อ</span>
                  <span className="space3"></span>
                  <span className="space3"></span>
                  <span className="space3"></span>
                  <span>สกุล</span>
                </p> */}
                  {/* <Divider /> */}
                </div>
              </Card>
              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Card size="small" style={{ height: "475px", overflow: "auto" }}>

                  <div style={{ marginBottom: "10px", marginTop: "20px", marginLeft: "30px", marginRight: "30px" }}>
                    <Row gutter={[16, 0]}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={4}>
                        <Form.Item
                          name="title_name"
                          label="คำนำหน้า"
                          rules={[{
                            required: true,
                            message: 'กรุณาเลือก!'
                          }]}>
                          <Select placeholder="เลือก"
                            // defaultValue="-เลือก-"
                            style={{ width: 90 }}
                            optionLabelProp="label"
                            // onChange={handleChange}
                            options={[
                              { value: 'นาย', label: 'นาย' },
                              { value: 'นาวสาว', label: 'นางสาว' },
                              { value: 'mr.', label: 'Mr.' },
                              { value: 'mrs.', label: 'Mrs.' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={10}>
                        <Form.Item
                          className="form-item-wrapper"
                          name="first_name"
                          label="ชื่อ"
                          rules={[{
                            required: true,
                            message: 'กรุณากรอกชื่อ!'
                          }]}>
                          <Input placeholder="เช่น คนดี" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={10}>
                        <Form.Item
                          className="form-item-wrapper"
                          name="last_name"
                          label="นามสกุล"
                          rules={[{
                            required: true,
                            message: 'กรุณากรอกนามสกุล!'
                          }]}>
                          <Input placeholder="เช่น จัง" />
                        </Form.Item>
                      </Col>
                    </Row>
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
                            message: "กรุณากรอกอีเมล!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper"
                        label="รหัสผ่าน"
                        name="user_pass"
                        rules={[
                          {
                            validator: (rule, value) => {
                              if (!value) {
                                return Promise.reject("กรุณากรอกรหัสผ่าน!");
                              } else if (value.length < 8) {
                                return Promise.reject("รหัสผ่านต้องมีอย่างน้อย 8 ตัว!");
                              } else {
                                return Promise.resolve();
                              }
                            },
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        name="confirm"
                        label="ยืนยันรหัสผ่าน"
                        dependencies={['user_pass']}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: 'กรุณายืนยันรหัสผ่าน!',
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('user_pass') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน!'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Divider orientation="right" style={{fontWeight: 'bolder', color: '#ff7518' }}>อธิบายเพิ่มเติม เพิ่มโอกาสได้งาน</Divider>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper2"
                        name="experience"
                        label="อธิบายประสบการณ์ล่าสุด"
                        rules={[{
                          
                        }]}>
                        <TextArea rows={3} placeholder="เช่น ผมทำงานมาแล้วทั่วโลก" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper2"
                        name="skill"
                        label="อธิบายทักษะของตัวเอง"
                        rules={[{
                          
                        }]}>
                        <TextArea rows={3} placeholder="เช่น ผมเก่งเจ๋ง" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        name="address"
                        label="ที่อยู่ปัจจุบัน"
                        rules={[{
                          required: true,
                          message: 'กรุณาเลือกจังหวัด!'
                        }]}>
                        <Select placeholder="เลือกจังหวัด"
                          // defaultValue="--เลือกจังหวัด--"
                          style={{ width: 610 }}
                          optionLabelProp="label"
                          // onChange={handleChange}
                          options={[
                            { value: 'กรุงเทพมหานคร', label: 'กรุงเทพมหานคร' },
                            { value: 'กาญจนบุรี', label: 'กาญจนบุรี' },
                            { value: 'กาฬสินธุ์', label: 'กาฬสินธุ์' },
                            { value: 'กำแพงเพชร', label: 'กำแพงเพชร' },
                            { value: 'ขอนแก่น', label: 'ขอนแก่น' },
                            { value: 'จันทบุรี', label: 'จันทบุรี' },
                            { value: 'ฉะเชิงเทรา', label: 'ฉะเชิงเทรา' },
                            { value: 'ชลบุรี', label: 'ชลบุรี' },
                            { value: 'ชัยนาท', label: 'ชัยนาท' },
                            { value: 'ชัยภูมิ', label: 'ชัยภูมิ' },
                            { value: 'ชุมพร', label: 'ชุมพร' },
                            { value: 'เชียงราย', label: 'เชียงราย' },
                            { value: 'เชียงใหม่', label: 'เชียงใหม่' },
                            { value: 'ตรัง', label: 'ตรัง' },
                            { value: 'ตราด', label: 'ตราด' },
                            { value: 'ตาก', label: 'ตาก' },
                            { value: 'นครนายก', label: 'นครนายก' },
                            { value: 'นครปฐม', label: 'นครปฐม' },
                            { value: 'นครพนม', label: 'นครพนม' },
                            { value: 'นครราชสีมา', label: 'นครราชสีมา' },
                            { value: 'นครศรีธรรมราช', label: 'นครศรีธรรมราช' },
                            { value: 'นครสวรรค์', label: 'นครสวรรค์' },
                            { value: 'นนทบุรี', label: 'นนทบุรี' },
                            { value: 'นราธิวาส', label: 'นราธิวาส' },
                            { value: 'น่าน', label: 'น่าน' },
                            { value: 'บึงกาฬ', label: 'บึงกาฬ' },
                            { value: 'บุรีรัมย์', label: 'บุรีรัมย์' },
                            { value: 'ปทุมธานี', label: 'ปทุมธานี' },
                            { value: 'ประจวบคีรีขันธ์', label: 'ประจวบคีรีขันธ์' },
                            { value: 'ปราจีนบุรี', label: 'ปราจีนบุรี' },
                            { value: 'ปัตตานี', label: 'ปัตตานี' },
                            { value: 'พระนครศรีอยุธยา', label: 'พระนครศรีอยุธยา' },
                            { value: 'พะเยา', label: 'พะเยา' },
                            { value: 'พังงา', label: 'พังงา' },
                            { value: 'พัทลุง', label: 'พัทลุง' },
                            { value: 'พิจิตร', label: 'พิจิตร' },
                            { value: 'พิษณุโลก', label: 'พิษณุโลก' },
                            { value: 'เพชรบุรี', label: 'เพชรบุรี' },
                            { value: 'เพชรบูรณ์', label: 'เพชรบูรณ์' },
                            { value: 'แพร่', label: 'แพร่' },
                            { value: 'ภูเก็ต', label: 'ภูเก็ต' },
                            { value: 'มหาสารคาม', label: 'มหาสารคาม' },
                            { value: 'มุกดาหาร', label: 'มุกดาหาร' },
                            { value: 'แม่ฮ่องสอน', label: 'แม่ฮ่องสอน' },
                            { value: 'ยโสธร', label: 'ยโสธร' },
                            { value: 'ยะลา', label: 'ยะลา' },
                            { value: 'ร้อยเอ็ด', label: 'ร้อยเอ็ด' },
                            { value: 'ระนอง', label: 'ระนอง' },
                            { value: 'ระยอง', label: 'ระยอง' },
                            { value: 'ราชบุรี', label: 'ราชบุรี' },
                            { value: 'ลพบุรี', label: 'ลพบุรี' },
                            { value: 'ลำปาง', label: 'ลำปาง' },
                            { value: 'ลำพูน', label: 'ลำพูน' },
                            { value: 'เลย', label: 'เลย' },
                            { value: 'ศรีสะเกษ', label: 'ศรีสะเกษ' },
                            { value: 'สกลนคร', label: 'สกลนคร' },
                            { value: 'สงขลา', label: 'สงขลา' },
                            { value: 'สตูล', label: 'สตูล' },
                            { value: 'สมุทรปราการ', label: 'สมุทรปราการ' },
                            { value: 'สมุทรสงคราม', label: 'สมุทรสงคราม' },
                            { value: 'สมุทรสาคร', label: 'สมุทรสาคร' },
                            { value: 'สระบุรี', label: 'สระบุรี' },
                            { value: 'สระแก้ว', label: 'สระแก้ว' },
                            { value: 'สิงห์บุรี', label: 'สิงห์บุรี' },
                            { value: 'สุโขทัย', label: 'สุโขทัย' },
                            { value: 'สุพรรณบุรี', label: 'สุพรรณบุรี' },
                            { value: 'สุราษฎร์ธานี', label: 'สุราษฎร์ธานี' },
                            { value: 'สุรินทร์', label: 'สุรินทร์' },
                            { value: 'หนองคาย', label: 'หนองคาย' },
                            { value: 'หนองบัวลำภู', label: 'หนองบัวลำภู' },
                            { value: 'อ่างทอง', label: 'อ่างทอง' },
                            { value: 'อำนาจเจริญ', label: 'อำนาจเจริญ' },
                            { value: 'อุดรธานี', label: 'อุดรธานี' },
                            { value: 'อุตรดิตถ์', label: 'อุตรดิตถ์' },
                            { value: 'อุทัยธานี', label: 'อุทัยธานี' },
                            { value: 'อุบลราชธานี', label: 'อุบลราชธานี' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </div>
                </Card>
                <Card style={{ height: "85px", marginTop: "-15px", }}>
                  <div className="label" style={{ marginLeft: "18px", marginRight: "30px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Button htmlType="submit" className='custom-button2' type="primary" size={size}>
                        ลงทะเบียน
                      </Button>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span className="text-wrapper-2">หรือ</span>
                      <span>&nbsp;&nbsp;</span>
                      <Link to='/' className='custom-button3' type="link">
                        เข้าสู่ระบบ
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


export default RegisterUserUI;

