import React, { useEffect, useState } from 'react';

import {
  LoginOutlined,
  UserOutlined,
  NotificationOutlined,
  SolutionOutlined,
  HomeOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  MenuOutlined,
  BellOutlined,
  SafetyOutlined,
  IdcardOutlined,


} from '@ant-design/icons';

import { Layout, Button, Card, Divider, Drawer, Row } from 'antd';
import { Form, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Modal from 'antd/es/modal/Modal';
import { DataWHU } from "../../../interfaces/index";
import TextArea from 'antd/es/input/TextArea';
import Avatar from 'antd/es/avatar/avatar';
import { Link } from 'react-router-dom';
import { CreateCandidate, GetCandidate } from '../../../services/https/cs';



type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTOCF = Exclude<EditableTableProps['columns'], undefined>;




const CandidateSelection: React.FC = () => {
  const [openMenu, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [comname, setComname] = useState();
  let [dataCS, setDataCS] = useState<DataWHU[]>([]);

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


  useEffect(() => {
    GetDataCS();
  }, []);

  const GetDataCS = async () => {
    let res = await GetCandidate();
    if (res) {
      // รับข้อมูลจาก GetCandidate และตั้งค่าให้ data เพื่อให้ columnsCandidate ใช้ข้อมูลจาก dataCS
      setDataCS(res);
    }
  };



  const { Header, Content } = Layout;



  const columnsCandidate: ColumnsType<DataWHU> = [

    {
      title: 'Name',
      dataIndex: 'UserName',
      align: 'center',
      width: '15%',
    },
    {
      title: 'Job Post',
      dataIndex: 'Position',
      align: 'center',
      width: '20%',
    },
    {
      title: 'Detail',
      dataIndex: 'Detail',
      align: 'center',
      width: '40%',
    },
    {

      title: 'Selection',
      align: 'center',
      width: '15%',
      key: 'key',
      render: (record) => (

        <Space >

          <Button onClick={() => AddDataToTableCF(record.UserID)}>
            <Space>

              เพิ่มรายชื่อ
              <UserAddOutlined />

            </Space>
          </Button>
        </Space>

      ),
    },
  ];




  // กด Add เพื่อย้ายข้อมูลไปอีกตาราง หลังจากย้ายให้ลบข้อมูลตารางเดิม
  const AddDataToTableCF = (id: React.Key) => {
    // หาข้อมูลที่ต้องการลบ
    const itemToCF = dataCS.find((item) => item.UserID === id);
    if (itemToCF) {
      // ลบข้อมูลจาก data
      const newData = dataCS.filter((item) => item.UserID !== id);
      // เปลี่ยนข้อมูลใน dataCS โดยใช้ setDataCS
      setDataCS(newData);
      // เพิ่มข้อมูลที่ถูกลบเข้าตารางที่ 2
      handleAddToConfirm(itemToCF);
    }
  };


  const handleAddToConfirm = (record: DataWHU) => {
    const newData: DataWHU = {
      ID: count,
      UserName: record.UserName,
      Position: record.Position,
      Detail: record.Detail,
      CandidatepostID: record.CandidatepostID,
      Status_cs: '',
      Read: false,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };


  const [dataSource, setDataSource] = useState<DataWHU[]>([]);
  const [count, setCount] = useState(1);




  // กด Delete เพื่อย้ายข้อมูลไปตารางแรก หลังจากย้ายให้ลบข้อมูลตารางเดิม
  const MoveDataBackToOriginalTable = (id: React.Key) => {
    // หาข้อมูลที่ต้องการย้ายกลับ
    const itemToMoveBack = dataSource.find((item) => item.ID === id);
    if (itemToMoveBack) {
      // ลบข้อมูลจาก dataSource หรือตารางที่ 2
      const newDataSource = dataSource.filter((item) => item.ID !== id);
      setDataSource(newDataSource);

      // เพิ่มข้อมูลที่ถูกลบเข้าตารางเดิม
      handleAddToOriginalTable(itemToMoveBack);
    }
  };

  const handleAddToOriginalTable = (record: DataWHU) => {
    const newData: DataWHU = {
      ID: record.ID,
      UserName: record.UserName,
      Position: record.Position,
      Detail: record.Detail,
      CandidatepostID: record.CandidatepostID,
      Status_cs: '',
      Read: false,
    };
    setDataCS([...dataCS, newData]);
    //setCount(count + 1);
  };




  const defaultColumns: (ColumnTOCF[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'NO',
      dataIndex: 'ID',
      align: 'center',
      width: '10%',
    },
    {
      title: 'Name',
      dataIndex: 'UserName',
      align: 'center',
      width: '20%',
    },
    {
      title: 'Job Post',
      dataIndex: 'Position',
      align: 'center',
      width: '20%',
    },
    {
      title: 'Selection',
      align: 'center',
      width: '20%',
      dataIndex: 'ID',
      render: (key: React.Key) => (
        dataSource.length > 0 ? (
          <Button onClick={() => MoveDataBackToOriginalTable(key)}>
            <Space>
              นำรายชื่อออก
              <UserDeleteOutlined />
            </Space>
          </Button>
        ) : null
      ),
    },
  ];








  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataWHU) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,

      }),
    };
  });


  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jobInterviewDetail, setJobInterviewDetail] = useState("");
  const [isPass, setIsPass] = useState(false);
  const [isReject, setIsReject] = useState(false);



  async function handleConfirmClick() {
    if (jobInterviewDetail && (isPass || isReject)) {
      if (dataSource.length >= 1) {
        const confirmedDataArray = dataSource.map((record) => ({
          ID: record.ID,
          Pass_or_rejection_details: jobInterviewDetail,
          Status_cs: isPass ? "Pass" : "Reject",
          CandidatepostID: record.CandidatepostID,
          Candidate: record.UserName,
          Read: record.Read,
          User_id: record.ID,

        }));

        try {
          // สร้าง CandidateSelection โดยเรียก API ที่เหมาะสม
          console.log(confirmedDataArray);
          await CreateCandidate(confirmedDataArray);

          // รีเซ็ตสถานะ Confirm
          setIsConfirmed(true);
          showModal();
          // ลบรายการที่ถูกยืนยันออกจาก dataSource
          setDataSource([]);
          setCount(1);
        } catch (error) {
          console.error("Error creating CandidateSelection and Notification: ", error);
        }
      } else {
        console.error("No data in dataSource");
      }
    } else {
      console.error("Please fill in all required information");
    }
  }










  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setIsConfirmed(false);
    setJobInterviewDetail("");
    setIsPass(false);
    setIsReject(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsConfirmed(false);
    setJobInterviewDetail("");
    setIsPass(false);
    setIsReject(false);
  };








  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id");
    localStorage.removeItem("result");
    window.location.href = "/";
  }




  return (


    <Layout>

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
          <Link to="/login/operator">
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
          <Link to={'/candidatehome/home'}>
            <text style={{
              fontSize: '50px', marginLeft: '30px',
              fontWeight: 'bolder', color: 'white'
            }}>
              <span style={{ color: '#ff7518' }}>JO</span>
              <span>B</span>
              <span style={{ color: '#ff7518' }}>JO</span>
              <span>B</span>
            </text>
          </Link>
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
      <Layout>

        <Content>
          <Card style={{ padding: 24, minHeight: 280, background: '#d9d9d9' }} >


            <>
              <Form
                layout="inline"
                className="components-table-demo-control-bar"
                style={{ marginBottom: 16 }}
              >

                <Divider>Candidate Selection JOBJOB</Divider>

              </Form>

              <Table


                bordered
                scroll={{ x: '100%', y: 240 }}

                size="middle"

                rowKey="id"

                columns={columnsCandidate}
                dataSource={dataCS}

                // columns={columnsCandidate}
                // dataSource={dataCS}

                footer={() => (
                  <div style={{ textAlign: 'center' }}>Suranaree University of Technology</div>
                )}
              />



            </>
          </Card>

        </Content>

      </Layout>

      <Layout>
        <div style={{ display: 'grid', gridTemplateColumns: '80% 20%' }}>
          <Card style={{ width: '100%', background: '#6e6e6e' }}>
            <Table
              rowClassName={() => 'editable-row'}
              bordered
              size="middle"
              scroll={{ x: '100%', y: 240 }}
              dataSource={dataSource}
              columns={columns as ColumnTOCF}
            />
          </Card>

          <Card style={{ display: 'flex', flexDirection: 'column', background: '#6e6e6e' }}>


            <Space direction="vertical" style={{ width: '100%' }} size="large">

              <Button onClick={handleConfirmClick}>
                {isConfirmed ? 'Confirmed' : 'Confirm and Sent'}
              </Button>

              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>

                  <input
                    type="radio"
                    name="status"
                    checked={isPass}
                    onChange={() => setIsPass(true)}
                  />
                  <label> Pass </label>
                </div>

                <div>

                  <input
                    type="radio"
                    name="status"
                    checked={isReject}
                    onChange={() => setIsReject(true)}
                  />
                  <label> Reject </label>
                </div>

              </div>

              <TextArea
                rows={4}
                placeholder="Enter Job Interview Detail or Enter Rejection Letter"
                value={jobInterviewDetail}
                onChange={(e) => setJobInterviewDetail(e.target.value)}
              />


              <Modal
                title="Confirmation"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>You confirm and send your file successful</p>
              </Modal>


            </Space>

          </Card>

        </div>
      </Layout>


    </Layout>
  );
};

export default CandidateSelection;


