import React, { useEffect, useState } from 'react';
import {
  Col,
  Card,
  Button,
  Form,
  Input,
  message,
  Divider,
  Row,
  Select,
  Avatar,
  Drawer,
} from "antd";
import {
  SolutionOutlined,
  NotificationOutlined,
  LoginOutlined,
  MenuOutlined,
  IdcardOutlined,
  SafetyOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./style.css";
import { Link } from "react-router-dom";
import { OperatorsInterface } from "../../../interfaces/IOperator";
import { GetOperators, UpdateOperator } from "../../../services/https/operator";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Header } from 'antd/es/layout/layout';
const { TextArea } = Input;

function ProfileOperator() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [operator, setOperators] = useState<OperatorsInterface>();
  const [openMenu, setMenuOpen] = useState(false);
  const [comname, setComname] = useState();


  const operatorID = localStorage.getItem('id'); // รับค่าจาก localStorage

  const onFinish = async (values: OperatorsInterface) => {
    try {
      values.ID = operator?.ID;
      let res = await UpdateOperator(values);
      if (res.status) {
        messageApi.success("บันทึกข้อมูลสำเร็จ");
        console.log(res);

        setTimeout(() => {
          window.location.href = "/profile/operator";
        }, 2000);
      } else {
        messageApi.error("บัญชีบริษัทนี้มีอยู่แล้วในฐานข้อมูล");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id");
    localStorage.removeItem("result");
    window.location.href = "/";
  }

  const handleProfile = () => {
    window.location.href = "/profile/operator";
  }

  const handleSecurity = () => {
    window.location.href = "/privacy/operator";
  }

  const getOperatorById = async () => {
    let res = await GetOperators(Number(operatorID));
    if (res) {
      setOperators(res);
      setComname(res.Com_name);
      // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
      form.setFieldsValue({
        com_name: res.Com_name, // ตั้งค่าชื่อบริษัทในฟอร์ม
        operator_email: res.Operator_email,
        address: res.Address,
      });
    }
  };



  useEffect(() => {
    getOperatorById();


  }, []);

  const showDrawer = () => {
    setMenuOpen(true);
  };

  const onClose = () => {
    setMenuOpen(false);
  };

  const [size, setSize] = useState<SizeType>('large'); // default is 'middle'

  return (
    <>
      <Drawer
        title="JOBJOB MENU"
        placement="right"
        closable={false}
        onClose={onClose}
        open={openMenu}
        key="right"
      >

        <Row style={{ marginTop: '10px', marginLeft: '20px' }}>
          <Avatar src="https://xsgames.co/randomoperators/avatar.php?g=pixel" style={{ cursor: 'pointer', transform: 'scale(2)' }}>

          </Avatar>
          <Link to="/login/operator" style={{ textDecoration: "none" }}>
            <text style={{
              fontSize: '20px', marginLeft: '25px',
              fontWeight: 'bolder', color: 'white'
            }}>
              <span style={{ color: '#000000' }}>{comname}</span>
            </text>
          </Link>

        </Row>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}></div>
        <Button onClick={handleProfile} icon={<IdcardOutlined />} style={{
          fontSize: '18px', fontWeight: 'bold', height: '45px',
          marginTop: '30px',
          width: '100%',
          textAlign: 'center'
        }}>
          Profile
        </Button>
        <Link to="/candidatehome/home">
          <Button icon={<NotificationOutlined />} style={{
            fontSize: '18px', fontWeight: 'bold', height: '45px',
            marginTop: '5px', width: '100%', textAlign: 'center'
          }}>
            Job Post
          </Button>
        </Link>
        <Link to="/operator/CandidateSelection">
          <Button icon={<SolutionOutlined />} style={{
            fontSize: '18px', fontWeight: 'bold', height: '45px',
            marginTop: '5px', width: '100%', textAlign: 'center'
          }}>
            Candidate
          </Button>
        </Link>
        <Button onClick={handleSecurity} icon={<SafetyOutlined />} style={{
          fontSize: '18px', fontWeight: 'bold', height: '45px',
          marginTop: '5px',
          width: '100%',
          textAlign: 'center'
        }}>
          Privacy
        </Button>
        <Button onClick={handleLogout} icon={<LoginOutlined />} style={{
          fontSize: '18px', fontWeight: 'bold', height: '45px',
          marginTop: '5px',
          width: '100%',
          textAlign: 'center'
        }}>
          <text>Logout</text>
        </Button>
      </Drawer>
      <Header style={{ padding: 0, background: '#333333' }}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // ชิดด้านขวา
          maxWidth: '99%'
        }}>
           <a href="/" style={{ textDecoration: "none" }}>
            <text style={{
              fontSize: '50px', marginLeft: '30px',
              fontWeight: 'bolder', color: 'white'
            }}>
              <span style={{ color: '#ff7518' }}>JO</span>
              <span>B</span>
              <span style={{ color: '#ff7518' }}>JO</span>
              <span>B</span>
            </text>
          </a>
          <div style={{ flex: 1 }}></div>

          <Button onClick={showDrawer} icon={<MenuOutlined />} style={{
            fontSize: '18px', fontWeight: 'bold',
            marginTop: '-15px', marginLeft: '5px',
            height: '45px',
            width: '110px',
          }}>
            MENU
          </Button>


        </div>

      </Header >

      {contextHolder}
      < Col xs={24} sm={24} md={24} lg={24} xl={24} >
        <div style={{ padding: 0, background: '#E8E8E8', display: "grid", height: "93.5vh" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            <Card style={{ height: "100px", marginTop: "70px", marginLeft: "50px", marginRight: "50px" }}>
              <div style={{ marginBottom: "10px", marginTop: "10px", marginLeft: "10px", marginRight: "10px" }}>
                <text style={{
                  fontSize: '22px',
                  fontWeight: 'bolder', color: 'white', justifySelf: 'center',
                  height: '-25px'
                }}>
                  <span style={{ color: '#ff7518' }}>Profile</span>
                </text>
              </div>
            </Card>
            <Form
              name="basic"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Card style={{ overflow: "auto", height: "570px", marginTop: "-10px", marginLeft: "50px", marginRight: "50px" }}>

                <div style={{ marginBottom: "10px", marginTop: "20px", marginLeft: "10px", marginRight: "10px" }}>

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      className="form-item-wrapper"
                      name="com_name"
                      label="ชื่อบริษัท"
                      rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
                    >
                      <Input placeholder="เช่น โชคชัย" />
                    </Form.Item>
                  </Col>
                  <Divider />
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      className="form-item-wrapper2"
                      name="address"
                      label="ที่อยู่"
                      rules={[{ required: true, message: "กรุณากรอก!" }]}
                    >
                      <TextArea
                        rows={5}
                        placeholder="เช่น 999 หมู่ 9 ถนนคอนกรีต ตำบลสุรนารี อำเภอเมือง จังหวัดนครราชสีมา 99999"
                      />
                    </Form.Item>
                  </Col>
                </div>
              </Card>
              <Card
                style={{
                  height: "90px",
                  marginTop: "-5px",
                  marginLeft: "50px",
                  marginRight: "50px",
                }}
              >
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
                    >
                      บันทึก
                    </Button>
                    {/* เพิ่มปุ่ม "แก้ไขข้อมูลส่วนตัว" ข้างหลังปุ่ม "บันทึก" */}
                    <Link to="/privacy/operator">
                      <Button
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          height: "5vh",
                          marginTop: "0px",
                          marginLeft: "20px",
                        }}
                        onClick={handleSecurity}
                      >
                        แก้ไขข้อมูลส่วนตัว
                      </Button>
                    </Link>
                  </Col>
                </div>

              </Card>
            </Form>
          </Col>
        </div>
      </Col >

    </>
  );
};


export default ProfileOperator;

