
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
  Table,
  TableProps,
  Drawer,
  Avatar,
  Modal,
} from "antd";
import {
  SafetyOutlined,
  UserOutlined,
  LoginOutlined,
  NotificationOutlined,
  SolutionOutlined,
  FormOutlined,
  CopyOutlined,
  BellOutlined,
  SnippetsOutlined,
  IdcardOutlined,
  MenuOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import "./style.css";
import { Link, useNavigate, } from "react-router-dom";
import { CandidateInterface } from "../../../interfaces/ICandidate";
import { CreateCandidatepost } from "../../../services/https/candidate";
import { GetCandidatepost } from "../../../services/https/candidate";
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Header } from 'antd/es/layout/layout';
import { ColumnsType, ExpandableConfig } from 'antd/es/table/interface';
import { DeletePost } from '../../../services/https/candidate';
import { GetOperators } from '../../../services/https/operator';
import { OperatorsInterface } from '../../../interfaces/IOperator';
const { TextArea } = Input;



function Candidatehome() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [passwordError, setPasswordError] = useState('');
  const [posts, setPosts] = useState<CandidateInterface[]>([]);
  const [deleteId, setDeleteId] = useState<Number>();
  const [modalText, setModalText] = useState<String>();
  const [open, setOpen] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [openMenu, setMenuOpen] = useState(false);
  const [comname, setComname] = useState();
  const [operator, setOperators] = useState<OperatorsInterface>();
  
  


  const operatorID = localStorage.getItem('id');

  const getPosts = async () => {
    let res = await GetCandidatepost(Number(operatorID));
    if (res) {
      setPosts(res);

    }
  };




  // const data: DataType[] = [];
  //   for (let i = 1; i <= 20; i++) {
  //     data.push({
  //       ID: i,
  //       Position: 'Position' ,
  //       Salary: `Salary ${i}`, 
  //       Dsecrition: `Description ${i}`,
  //       Topic: `Topic ${i}`,
  //       Address: `Address ${i}`,
  //     });
  //   }
  // const defaultExpandable = { expandedRowRender: (record: DataType) => <p>{record.Dsecrition}</p> };
  // const [expandable, setExpandable] = useState<ExpandableConfig<DataType> | undefined>(
  //     defaultExpandable,
  //   );

  // const [tableLayout, setTableLayout] = useState();
  // const tableProps: TableProps<DataType> = {

  //     expandable,
  //     tableLayout,
  //   };

  const handleOkDelete = async () => {
    try {
      let res = await DeletePost(Number(deleteId));
      if (res) {
        messageApi.success("ลบข้อมูลสำเร็จ");
        console.log(res);

        setTimeout(() => {
          window.location.href = "/candidatehome/home";
        }, 1500);
      } else {
        let res = await DeletePost(Number(deleteId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancleDelete = () => {
    setOpenDelete(false);
  };

  const showModal = (val: CandidateInterface) => {
    setModalText(
      `คุณต้องการลบ "${val.Topic}" หรือไม่ ?`
    );
    setDeleteId(val.ID);
    setOpenDelete(true);
  };


  const columns: ColumnsType<CandidateInterface> = [

    {
      title: "หัวข้อประกาศงาน",
      dataIndex: "Topic",
      key: "topic",
    },
    {
      title: "ตำแหน่งที่ต้องการ",
      dataIndex: "Position",
      key: "position",
    },
    {
      title: "เงินเดือน",
      dataIndex: "Salary",
      key: "salary",
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'Dsecrition',
      key: 'dsecrition',
      render: (text: string) => (
        <div>
          {text.split('\n').map((item, key) => {
            return <div key={key}>{item}</div>;
          })}
        </div>
      ),
    },

    {
      title: "ที่อยู่ทำงาน",
      dataIndex: "Address",
      key: "Address",
    },
    {
      title: "จัดการ",
      dataIndex: "Manage",
      key: "manage",
      render: (text, record, index) => (
        <>

          <Button
            onClick={() => showModal(record)}
            style={{ marginLeft: 10 }}
            shape="circle"
            icon={<DeleteOutlined />}
            size={"large"}
            danger
          />
        </>
      ),
    },

  ];



  const onFinish = async (values: CandidateInterface) => {
    try {
      const res = await CreateCandidatepost(values);
      if (res.status) {
        messageApi.success("บันทึกข้อมูลสำเร็จ");

        // setTimeout(() => {
        //   navigate("/candidate/postnext");
        // }, 2000);
      } else {
        messageApi.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getOperatorById = async () => {
    let res = await GetOperators(Number(operatorID));
    if (res) {
      setOperators(res);
      setComname(res.Com_name);
    }
  };


  const [size, setSize] = useState<SizeType>('large'); // default is 'middle'

  // ส่วนของ Header and sider // อยู่นอก return



  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id");
    localStorage.removeItem("result");
    window.location.href = "/";
  }

  useEffect(() => {
    getPosts();
    getOperatorById();
  }, []);

  const handleSecurity = () => {
    window.location.href = "/privacy/operator";
  }
  const handleProfile = () => {
    window.location.href = "/profile/operator";
  }

  const showDrawer = () => {
    setMenuOpen(true);
  };

  const onClose = () => {
    setMenuOpen(false);
  };


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
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div className='img-candidate' style={{ display: "grid", height: "91vh", width: "100%" }}>
          <Space direction="vertical" size="middle">
            <Card style={{ display: "grid", placeItems: "center", width: "100%" }}>
              <div className="label" >
                <p className="div">
                  {/* <span className="space2"></span> */}
                  <Row >
                    <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                      <Link to='/candidate/post'>
                        <Button style={{
                          fontSize: '50px', // เพิ่มขนาดของไอคอนเป็น 24px (หรือค่าที่คุณต้องการ)
                          fontWeight: 'bold',
                          height: '100%',
                          marginTop: '-5%',
                          marginLeft: '-100%',
                        }}>
                          <FormOutlined style={{ color: 'green ' }} /> {/* คงความเหมือนเดิมของไอคอน */}
                        </Button>
                      </Link>
                    </Col>
                    <Col xs={8} sm={12} md={8} lg={8} xl={8}>
                      <Link to='/operator/CandidateSelection'>
                        <Button style={{
                          fontSize: '50px', // เพิ่มขนาดของไอคอนเป็น 24px (หรือค่าที่คุณต้องการ)
                          fontWeight: 'bold',
                          height: '100%',
                          marginTop: '-5%',
                          marginLeft: '0%',
                        }}>
                          <CopyOutlined style={{ color: 'red' }} /> {/* คงความเหมือนเดิมของไอคอน */}
                        </Button>
                      </Link>
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                      <Link to='/opsearch'>
                        <Button style={{
                          fontSize: '50px', // เพิ่มขนาดของไอคอนเป็น 24px (หรือค่าที่คุณต้องการ)
                          fontWeight: 'bold',
                          height: '100%',
                          marginTop: '-5%',
                          marginLeft: '120%',
                        }}>
                          <SearchOutlined style={{ color: 'blue' }} /> {/* คงความเหมือนเดิมของไอคอน */}
                        </Button>
                      </Link>
                    </Col>
                  </Row>

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
              <Row style={{ marginRight: '-110%' }}>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Link to='/candidate/post' className='custom-button3' type="link" style={{ marginLeft: '-55%', fontSize: '16px', color: 'green' }}>
                    <text>โพสต์ประกาศงาน</text>
                  </Link>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Link to='/operator/CandidateSelection' className='custom-button3' type="link" style={{ marginLeft: '-50%', marginRight: '20px', fontSize: '16px', color: 'red' }}>
                    <text>รายชื่อผู้สมัคร</text>

                  </Link>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Link to='/opsearch' className='custom-button3' type="link" style={{ marginLeft: '-50%', marginRight: '20px', fontSize: '16px', color: 'blue' }}>
                    <text>ค้นหาผู้หางาน</text>

                  </Link>
                </Col>
              </Row>
            </Card>
            <Form
              name="basic"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Card style={{ padding: 24, minHeight: 240, background: '#d9d9d9' }} >

                <>
                  <Form
                    layout="inline"
                    className="components-table-demo-control-bar"
                    style={{ marginBottom: 5 }}
                  >



                  </Form>

                  <Table rowKey="ID" columns={columns} dataSource={posts} />

                </>
              </Card>
              {/* <Card style={{ height: "85px",marginTop: "-15px",}}>
              <div className="label" style={{ marginLeft: "18px", marginRight: "30px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Button htmlType="submit" className='custom-button2' type="primary" size={size}>
                    เข้าสู่ระบบ
                  </Button>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span className="text-wrapper-2">หรือ</span>
                  <span>&nbsp;&nbsp;</span>
                  <Link to='/candidate/post' className='custom-button3' type="link">
                    ลงทะเบียน
                  </Link>
                  <span>&nbsp;&nbsp;</span>
                  <span className="text-wrapper-2">ด้วยอีเมล?</span>
                </Col>
              </div>
              
            </Card> */}
            </Form>
          </Space>
        </div>
      </Col>
      <Modal
        title="ลบข้อมูล ?"
        open={opendelete}
        onOk={handleOkDelete}
        // confirmLoading={confirmLoading}
        onCancel={handleCancleDelete}
      >
        <p>{modalText}</p>
      </Modal>

    </>
  );
};

export default Candidatehome;

function showModal(record: CandidateInterface): void {
  throw new Error('Function not implemented.');
}

function setModalText(arg0: string) {
  throw new Error('Function not implemented.');
}

