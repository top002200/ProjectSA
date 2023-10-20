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
  LoginOutlined,
  MenuOutlined,
  IdcardOutlined,
  SafetyOutlined,
  BellOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./style.css";
import { Link } from "react-router-dom";
import { NotiInterface, UsersInterface } from "../../../interfaces/IUser";
import { GetUsers, GetUsersNoti, UpdateUser } from "../../../services/https/user";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Header } from 'antd/es/layout/layout';
import Table, { ColumnsType } from 'antd/es/table';
const { TextArea } = Input;

function ProfileUserUI() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [user, setUsers] = useState<UsersInterface>();
  const [noti, setNoti] = useState<NotiInterface[]>([]);
  const [openMenu, setMenuOpen] = useState(false);
  const [openNoti, setNotiOpen] = useState(false);
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();


  const userID = localStorage.getItem('id'); // รับค่าจาก localStorage

  const onFinish = async (values: UsersInterface) => {
    try {
      values.ID = user?.ID;
      let res = await UpdateUser(values);
      if (res.status) {
        messageApi.success("บันทึกข้อมูลสำเร็จ");
        console.log(res);

        setTimeout(() => {
          window.location.href = "/profile/user";
        }, 2000);
      } else {
        messageApi.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNoti = async () => {
    let resnoti = await GetUsersNoti(Number(userID));
    if (resnoti) {
      setNoti(resnoti);
    }
  };
 
  const noticolumns: ColumnsType<NotiInterface> = [
    {
      title: "บริษัท",
      dataIndex: "Com_name",
      key: "com_name",
      width: '25%',
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "Position",
      key: "position",
      width: '20%',
    },
    {
      title: "สถานะ",
      dataIndex: "StatusNoti",
      key: "StatusNoti",
      width: '10%',
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'Content',
      key: 'Content',
      render: (text: string) => (
        <div style={{ textAlign: 'left', whiteSpace: 'pre-line', maxWidth: '50ch', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text.split('\n').map((item, key) => {
            return <div key={key}>{item}</div>;
          })}
        </div>
      ),
    },
    
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id");
    localStorage.removeItem("result");
    window.location.href = "/";
  }

  const handleProfile = () => {
    window.location.href = "/profile/user";
  }

  const handleSecurity = () => {
    window.location.href = "/privacy/user";
  }

  const getUserById = async () => {
    let res = await GetUsers(Number(userID));
    if (res) {
      setUsers(res);
      setFname(res.First_name);
      setLname(res.Last_name);
      // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
      form.setFieldsValue({
        title_name: res.Title_name,
        first_name: res.First_name,
        last_name: res.Last_name,
        user_email: res.User_email,
        experience: res.Experience,
        skill: res.Skill,
        address: res.Address,
      });
    }
  };



  useEffect(() => {
    getUserById();
    getNoti();

  }, []);

  const showDrawer = () => {
    setMenuOpen(true);
  };

  const onClose = () => {
    setMenuOpen(false);
  };

  // Noti
  const showNoti = () => {
    setNotiOpen(true);
  };

  const onCloseNoti = () => {
    setNotiOpen(false);
  };
  //--

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
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" style={{ cursor: 'pointer', transform: 'scale(2)' }}>

          </Avatar>
          <Link to="/login/user">
            <text style={{
              fontSize: '20px', marginLeft: '25px',
              fontWeight: 'bolder', color: 'white'
            }}>
              <span style={{ color: '#ff7518' }}>{fname}</span>
              <span>&nbsp;&nbsp;</span>
              <span style={{ color: '#ff7518' }}>{lname}</span>
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
      <Drawer
        title="JOBJOB Notification"
        placement="right"
        closable={false}
        onClose={onCloseNoti}
        open={openNoti}
        key="right"
        width={1000}
      >

        <Table rowKey="ID" columns={noticolumns} dataSource={noti} />
        <Button onClick={onCloseNoti} icon={<RightOutlined />} style={{
          fontSize: '18px', fontWeight: 'bold', height: '45px',
          marginTop: '5px',
          width: '20%',
          textAlign: 'center'
        }}>
          <text>ปิดหน้าต่าง</text>
        </Button>

      </Drawer>
      <Header style={{ padding: 0, background: '#333333' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // ชิดด้านขวา
          maxWidth: '99%'
        }}>
          <text style={{
            fontSize: '50px', marginLeft: '30px',
            fontWeight: 'bolder', color: 'white'
          }}>
            <span style={{ color: '#ff7518' }}>JO</span>
            <span>B</span>
            <span style={{ color: '#ff7518' }}>JO</span>
            <span>B</span>
          </text>
          <div style={{ flex: 1 }}></div>

          <Button onClick={showNoti} icon={<BellOutlined />} style={{
            fontSize: '0px', fontWeight: 'bold',
            marginTop: '0px', marginLeft: '20px',
            height: '45px',
            width: '50px',
          }}>

          </Button>
          <Button onClick={showDrawer} icon={<MenuOutlined />} style={{
            fontSize: '18px', fontWeight: 'bold',
            marginTop: '0px', marginLeft: '5px',
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
                  <span style={{ color: '#ff7518' }}>My Profile</span>
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
                      name="title_name"
                      label="คำนำหน้า"
                      rules={[{
                        required: true,
                        message: 'กรุณาเลือก!'
                      }]}>
                      <Select placeholder="เลือก"
                        // defaultValue="-เลือก-"
                        style={{ width: 100 }}
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
                  <Col xs={24} sm={24} md={24} lg={14} xl={12}>
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
                  <Col xs={24} sm={24} md={24} lg={14} xl={12}>
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
                  <Divider />
                  <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                    <Form.Item
                      className="form-item-wrapper2"
                      name="experience"
                      label="อธิบายประสบการณ์ล่าสุด"
                      rules={[{
                        // required: true,
                        // message: 'กรุณากรอก!'
                      }]}>
                      <TextArea rows={3} placeholder="เช่น ผมทำงานมาแล้วทั่วโลก" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                    <Form.Item
                      className="form-item-wrapper2"
                      name="skill"
                      label="อธิบายทักษะของตัวเอง"
                      rules={[{
                        // required: true,
                        // message: 'กรุณากรอก!'
                      }]}>
                      <TextArea rows={3} placeholder="เช่น ผมเก่งเจ๋ง" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                    <Form.Item
                      name="address"
                      label="ที่อยู่ปัจจุบัน"
                      rules={[{
                        required: true,
                        message: 'กรุณาเลือกจังหวัด!'
                      }]}>
                      <Select placeholder="เลือกจังหวัด"
                        style={{ width: 200 }}
                        optionLabelProp="label"
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
              <Card style={{ height: "90px", marginTop: "-5px", marginLeft: "50px", marginRight: "50px" }}>
                <div className="label" style={{ marginLeft: "18px", marginRight: "30px" }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Button htmlType="submit" className='custom-button2' type="primary" size={size}>
                      บันทึก
                    </Button>
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


export default ProfileUserUI;

