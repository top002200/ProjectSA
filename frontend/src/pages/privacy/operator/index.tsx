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
  Avatar,
  Drawer,
  Modal,
  Checkbox,
} from "antd";
import {
  NotificationOutlined,
  SolutionOutlined,
  LoginOutlined,
  MenuOutlined,
  IdcardOutlined,
  SafetyOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./style.css";
import { Link } from "react-router-dom";
import { OperatorsInterface } from "../../../interfaces/IOperator";
import { GetOperators, UpdatePrivacyOperator, DeleteOperator } from "../../../services/https/operator";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Header } from 'antd/es/layout/layout';

function PrivacyOperator() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [oldpassword, setOldPassword] = useState();
  const [operator, setOperators] = useState<OperatorsInterface>();
  const [open, setOpen] = useState(false);
  const [comname, setComname] = useState();
  const [openModelDelete, setOpenModelDelete] = useState(false);
  const [openModelSave, setOpenModelSave] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [componentEnable, setComponentEnable] = useState<boolean>(false);
  const [openNoti, setNotiOpen] = useState(false);
  const [openMenu, setMenuOpen] = useState(false);


  const operatorID = localStorage.getItem('id'); // รับค่าจาก localStorage

  const onFinish = async (values: OperatorsInterface) => {
    try {
      values.ID = operator?.ID;
      let res = await UpdatePrivacyOperator(values);
      if (res.status) {
        messageApi.success("บันทึกข้อมูลสำเร็จ");
        console.log(res);

        setTimeout(() => {
          window.location.href = "/privacy/operator";
        }, 2000);
      } else {
        messageApi.error(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      let res = await DeleteOperator(Number(operatorID));
      if (res) {
        messageApi.success("ลบข้อมูลสำเร็จ");
        console.log(res);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id");

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
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
  const handleSecurity = () => {
    window.location.href = "/privacy/operator";
  }


  const handleProfile = () => {
    window.location.href = "/profile/operator";
  }




  const getOperatorById = async () => {
    let res = await GetOperators(Number(operatorID));
    if (res) {
      setOperators(res);
      setOldPassword(res.Operator_pass);
      setComname(res.Com_name);
      // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
      form.setFieldsValue({
        operator_email: res.Operator_email,
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

  // ModelDelete
  const showModalDelete = () => {
    setOpenModelDelete(true);
  };

  const handleCancelDelete = () => {
    console.log('Clicked cancel button');
    setOpenModelDelete(false);
  };

  // ModelSave
  const showModalSave = () => {
    setOpenModelSave(true);
  };

  const handleCancelSave = () => {
    console.log('Clicked cancel button');
    setOpenModelSave(false);
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
                  <span style={{ color: '#ff7518' }}>Privacy</span>
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

                  <Col xs={24} sm={24} md={24} lg={14} xl={12}>
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
                  <Checkbox
                    checked={componentEnable}
                    onChange={(e) => setComponentEnable(e.target.checked)}
                    style={{ marginBottom: '15px' }}
                  >
                    เปลี่ยนรหัสผ่าน
                  </Checkbox>
                  <Form
                    name="basic"
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    disabled={!componentEnable}
                  >
                    <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                      <Form.Item
                        className="form-item-wrapper"
                        label="รหัสผ่านใหม่"
                        name="operator_pass"
                        rules={[
                          {
                            min: 8,
                            // required: true,
                            message: "กรุณากรอกรหัสอย่างน้อย 8 ตัวขึ้นไป!",
                          },

                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                      <Form.Item
                        name="confirm"
                        label="ยืนยันรหัสผ่านใหม่"
                        dependencies={['operator_pass']}
                        hasFeedback
                        rules={[
                          {
                            // required: true,
                            // message: 'กรุณายืนยันรหัสผ่าน!',
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('operator_pass') === value) {
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
                  </Form>
                  <Divider />
                  <Button onClick={showModalDelete} danger>ลบบัญชีผู้ใช้</Button>
                </div>
              </Card>
              <Card style={{ height: "90px", marginTop: "-5px", marginLeft: "50px", marginRight: "50px" }}>
                <div className="label" style={{ marginLeft: "10px", marginRight: "30px" }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Button onClick={showModalSave} className='custom-button2' size={size}>
                      บันทึก
                    </Button>
                  </Col>
                </div>
              </Card>
              <Modal
                style={{ marginTop: "10%" }}
                open={openModelSave}
                confirmLoading={confirmLoading}
                onCancel={handleCancelSave}
                footer={[]}
              >
                <text style={{
                  fontSize: '20px', marginLeft: '0px',
                  fontWeight: 'bolder', color: 'white'
                }}>
                  <span style={{ color: '#ff7518' }}>ยืนยันการบันทึก</span>
                </text>
                <Divider style={{ marginTop: '10px' }} />
                <Form
                  name="basic"
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off">
                  <Form.Item
                    className="form-item-wrapper"
                    label="รหัสผ่านปัจจุบัน"
                    name="old_pass"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสผ่าน!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || oldpassword === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('รหัสผ่านไม่ตรงกับรหัสเดิม!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Row>
                    <Button onClick={handleCancelSave} key="back" style={{ marginLeft: '69.5%' }}>
                      ยกเลิก
                    </Button>
                    <Button style={{ marginLeft: '1%', backgroundColor: '#ff7518' }} htmlType="submit" type="primary">
                      บันทึก
                    </Button>
                  </Row>
                </Form>

              </Modal>
            </Form>

            <Modal
              style={{ marginTop: "10%" }}
              open={openModelDelete}
              confirmLoading={confirmLoading}
              onCancel={handleCancelDelete}
              footer={[]}
            >
              <text style={{
                fontSize: '20px', marginLeft: '0px',
                fontWeight: 'bolder', color: 'white'
              }}>
                <span style={{ color: '#ff7518' }}>ยืนยันการลบบัญชี</span>
              </text>
              <Divider style={{ marginTop: '10px' }} />
              <p>กรุณากรอกรหัสผ่านยืนยันการลบบัญชี</p>
              <Form
                name="basic"
                form={form}
                layout="vertical"
                onFinish={onDelete}
                autoComplete="off"
              >
                <Form.Item
                  className="form-item-wrapper"
                  label="รหัสผ่าน"
                  name="old_pass2"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกรหัสผ่าน!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || oldpassword === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('รหัสผ่านไม่ตรงกับรหัสเดิม!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Row>
                  <Button onClick={handleCancelDelete} key="back" style={{ marginLeft: '69.5%' }}>
                    ยกเลิก
                  </Button>
                  <Button style={{ marginLeft: '1%', backgroundColor: '#ff7518' }} htmlType="submit" type="primary">
                    บันทึก
                  </Button>
                </Row>
              </Form>

            </Modal>
          </Col>
        </div>
      </Col >
    </>
  );
};


export default PrivacyOperator;

