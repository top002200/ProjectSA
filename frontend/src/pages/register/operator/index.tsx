import React, { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { OperatorsInterface } from "../../../interfaces/IOperator";
import { CreateOperator } from "../../../services/https/operator";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { Helmet } from "react-helmet";
const { TextArea } = Input;

function RegisterOperator() {
  // const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const operatorPassword = form.getFieldValue("operator_pass");
    const confirmPassword = form.getFieldValue("confirm_password");

    if (operatorPassword !== confirmPassword) {
      setPasswordError("รหัสผ่านไม่ตรงกัน");
    } else {
      setPasswordError("");
    }
  }, [form]);

  const onFinish = async (values: OperatorsInterface) => {
    try {
      const res = await CreateOperator(values);
      if (res.status) {
        messageApi.success("ลงทะเบียนสำเร็จ");

        setTimeout(() => {
          window.location.href = "/op";
        }, 2000);
      } else {
        messageApi.error(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    setTimeout(() => {
      window.location.href = "/register/user";
    }, 500);
  }

  const [size, setSize] = useState<SizeType>("large"); // default is 'middle'

  return (
    <>
      <Helmet>
        <title>JOBJOB : Register</title>
      </Helmet>
      {contextHolder}
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div
          className="img-back"
          style={{ display: "grid", placeItems: "center", height: "100vh" }}
        >
          <text
            style={{
              fontSize: "60px",
              marginLeft: "0px",
              marginTop: "20px",
              fontWeight: "bolder",
              color: "white",
            }}
          >
            <span style={{ color: "#ff7518" }}>JO</span>
            <span>B</span>
            <span style={{ color: "#ff7518" }}>JO</span>
            <span>B</span>
          </text>
          <Space direction="vertical" size="middle">
            <div style={{ marginTop: "-140px" }}>
              <Card style={{ height: "130px", marginBottom: "-30px" }}>
                <div
                  className="label"
                  style={{ marginLeft: "30px", marginRight: "30px" }}
                >
                  <p className="div">
                    <span className="text-wrapper"
                    style={{ color: '#3b50ce', borderColor: '#3b50ce' }}
                    >ลงทะเบียน</span>
                    <span className="span">&nbsp;</span>
                    <span className="text-wrapper-2">สำหรับผู้ประกอบการ</span>
                    <span className="space1"></span>
                    <Button onClick={handleClick} className="custom-button" danger
                    style={{ backgroundColor: '#d0d9ff', color: '#3b50ce', borderColor: '#3b50ce' }}
                    >
                      ลงทะเบียน สำหรับผู้หางาน
                    </Button>
                  </p>
                </div>
              </Card>
              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Card
                  size="small"
                  style={{ height: "475px", overflow: "auto" }}
                >
                  <div
                    style={{
                      marginBottom: "10px",
                      marginTop: "20px",
                      marginLeft: "30px",
                      marginRight: "30px",
                    }}
                  >
                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper"
                        name="com_name"
                        label="ชื่อบริษัท"
                        rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
                      >
                        <Input placeholder="เช่น คนดี" />
                      </Form.Item>
                    </Col>
                  </Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper"
                        label="อีเมล"
                        name="operator_email"
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
                      name="operator_pass"
                      rules={[
                        {
                          required: true,
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
                        dependencies={["operator_pass"]}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "กรุณายืนยันรหัสผ่าน!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("operator_pass") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("รหัสผ่านไม่ตรงกัน!")
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        className="form-item-wrapper2"
                        name="address"
                        label="ที่อยู่"
                        rules={[{ required: true, message: "กรุณากรอก!" }]}
                      >
                        <TextArea
                          rows={3}
                          placeholder="เช่น 999 หมู่ 9 ถนนคอนกรีต ตำบลสุรนารี อำเภอเมือง จังหวัดนครราชสีมา 99999"
                        />
                      </Form.Item>
                    </Col>
                  </div>
                </Card>
                <Card style={{ height: "85px", marginTop: "-15px" }}>
                  <div
                    className="label"
                    style={{ marginLeft: "18px", marginRight: "30px" }}
                  >
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Button
                        htmlType="submit"
                        className="custom-button2"
                        type="primary"
                        size={size}
                        style={{ backgroundColor: '#3b50ce', color: 'white', borderColor: '#3b50ce' }}
                      >
                        ลงทะเบียน
                      </Button>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span className="text-wrapper-2">หรือ</span>
                      <span>&nbsp;&nbsp;</span>
                      <Link to="/op" className="custom-button3" type="link">
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
}

export default RegisterOperator;
