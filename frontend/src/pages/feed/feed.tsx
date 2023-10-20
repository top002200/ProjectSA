import sut from "../../public/sut.png";
import logo from "../../public/jobjob.png";

import person1 from "../../public/person1.jpg";
import { GetPost, UploadImage, GetLatestWHU } from "../../services/https/feed.service";
import { useEffect, useState, KeyboardEvent } from 'react';
import { style } from "./feedcss"
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Swal from 'sweetalert2'
import { CreateRegWork } from "../../services/https/feed.service";
import { SearchWork } from "../../services/https/feed.service"
import { Helmet } from 'react-helmet';
import { Avatar, Button, Drawer, Row, Table } from "antd";
import { Link } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import {
    SolutionOutlined,
    NotificationOutlined,
    LoginOutlined,
    MenuOutlined,
    IdcardOutlined,
    SafetyOutlined,
    BellOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { NotiInterface, UsersInterface } from "../../interfaces/IUser";
import { GetUsers, GetUsersNoti } from "../../services/https/user";

function Feed() {

    // const navigate = useNavigate();
    // const [messageApi, contextHolder] = message.useMessage();
    const userID = Number(localStorage.getItem("id"))
    const [openMenu, setMenuOpen] = useState(false);
    const [comname, setComname] = useState();
    const [openNoti, setNotiOpen] = useState(false);
    const [noti, setNoti] = useState<NotiInterface[]>([]);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [user, setUsers] = useState<UsersInterface>();

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

    const getNoti = async () => {
        let resnoti = await GetUsersNoti(Number(userID));
        if (resnoti) {
            setNoti(resnoti);
        }
    };

    const getUserById = async () => {
        let res = await GetUsers(Number(userID));
        if (res) {
            setUsers(res);
            setFname(res.First_name);
            setLname(res.Last_name);
        }
    };

    useEffect(() => {
        getUserById();
        getNoti();

    }, []);

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

    // Last Post id
    const [whul, setWhul] = useState([{
        "ID": 0,
        "Position": "",
        "Dsecrition": "",
        "CreatedAt": "",
        "Operator": {
            "Com_name": ""
        }
    }]);

    // Post
    const [data, setData] = useState([{
        "ID": 0,
        "Position": "",
        "Dsecrition": "",
        "CreatedAt": "",
        "Operator": {
            "Com_name": ""
        }
    }]);

    useEffect(() => {
        getPost();
        updateLastpostID();
    }, []);

    const handleReload = () => {
        window.location.reload();
    };

    const getPost = async () => {
        try {
            const response = await GetPost();
            if (!response) {
                throw new Error('ไม่สามารถดึงข้อมูล API ได้');
            }
            const data = await response;
            setData(data);
            setResponse(data)
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึง API:', error);
        }
    };

    const updateLastpostID = async () => {

        try {
            const response = GetLatestWHU();
            if (!response) {
                throw new Error('ไม่สามารถดึงข้อมูล API ได้');
            }
            const whul = await response;
            setWhul(whul);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึง API:', error);
        }
    };

    const [key, setKey] = useState(''); // State to store the input value
    const [response, setResponse] = useState(data); // State to store the response

    // Search
    const handleEnterKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            let inputValue = event.currentTarget.value;
            console.log("input = \"" + inputValue + "\"")
            setKey(inputValue); // Update the "key" state with the input value

            try {
                const response = await SearchWork(inputValue);
                setResponse(response);
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // LogData
    const logData = () => {
        console.log("Last Post ID : " + whul[0].ID);
    }

    // Register
    const createReg = async (post_id: number) => {
        let data = {
            Status: false,
            UserID: userID,
            CandidatepostID: post_id
        }
        let res = await CreateRegWork(data);
        if (res.status) {
            console.log("Create Success!!!")
        } else {
            console.log("Create Error!!!")
        }
    }

    // Upload Resume
    const uploadResume = (position: string, company: string, post_id: number) => {
        let fileInput: HTMLInputElement | null = null;
        Swal.fire({
            title: `<strong>สมัครงาน </strong>${position} กับ ${company}`,
            icon: 'info',
            html: `
            กรุณาอัพโหลด Resume ของคุณ<br><br>
            <form id="imageUploadForm">
              <input name="file" type="file" accept="image/jpeg, image/jpg, image/png, image/PNG"/>
            </form>
            <div id="fileValidationMessage" style="color: red;"></div>
          `,
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> ยืนยัน',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> ยกเลิก',
            cancelButtonAriaLabel: 'Thumbs down',
            didOpen: () => {
                // Get the file input element and set it to fileInput
                fileInput = document.querySelector('input[type="file"]');
            },
            preConfirm: () => {
                if (!fileInput?.files?.length) {
                    const fileValidationMessage = document.getElementById('fileValidationMessage');
                    if (fileValidationMessage) {
                        fileValidationMessage.textContent = 'Please select a file.';
                    }
                    return false; // Prevent closing the dialog
                }
                return true; // Close the dialog
            },
        }).then((result) => {
            if (result.isConfirmed && fileInput) {
                const uploadedFile = fileInput.files?.[0];
                if (uploadedFile) {
                    console.log(post_id)
                    createReg(post_id)
                    UploadImage(uploadedFile, whul[0].ID + 1)
                    // handleReload()
                }
            }
        });
    };

    /// Post Gen
    const post = [];
    for (let i = 1; i <= response.length; i++) {

        let newpost = response[i - 1]
        let post_id = newpost.ID
        let position = newpost.Position
        let company = newpost.Operator.Com_name
        let description = newpost.Dsecrition
        let timeStamp = newpost.CreatedAt
        post.push(
            <div>
                <div id={post_id.toString()} style={style.post}>
                    {/* POST Header */}
                    <div style={style.postHeader} className="d-flex justify-content-between">
                        {/* Left */}
                        <div className="d-flex justify-content-between">
                            <img src={sut} alt="" style={style.companylogo} />
                            <div>
                                <div style={style.companyName}>
                                    {company}
                                </div>
                                <div style={style.timeStamp}>
                                    {timeStamp}
                                </div>
                            </div>
                        </div>
                        {/* Right */}
                        <div className="justify-content-between">
                            <div className='d-flex justify-content-between align-items-center' style={style.position}>
                                <div style={style.positiontext}>
                                    {position}
                                </div>
                                <button style={style.btnReg} onClick={() => uploadResume(position, company, post_id)}>
                                    <div style={style.regText}>สมัครงาน</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* POST Description */}
                    <div style={style.postBody}>
                        {description}

                    </div>
                </div>
            </div>
        );
    }


    return (
        <div>
            <Helmet>
                <title>JOBJOB</title>
                <link rel="icon" href="./logoFeed.ico" />
            </Helmet>
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
                    <a href="/login/user" style={{ textDecoration: "none" }}>
                        <text style={{
                            fontSize: '20px', marginLeft: '25px',
                            fontWeight: 'bolder', color: 'white'
                        }}>
                            <span style={{ color: '#ff7518' }}>{fname}</span>
                            <span>&nbsp;&nbsp;</span>
                            <span style={{ color: '#ff7518' }}>{lname}</span>
                        </text>
                    </a>

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
                    <div>
                        <input
                            type="text"
                            id="searchWork"
                            style={style.searchbg}
                            onKeyPress={handleEnterKeyPress} // Add event listener
                        />
                    </div>
                    <div style={{ flex: 1 }}></div>

                    <Button onClick={showNoti} icon={<BellOutlined />} style={{
                        fontSize: '0px', fontWeight: 'bold',
                        marginTop: '-15px', marginLeft: '20px',
                        height: '45px',
                        width: '50px',
                    }}>

                    </Button>
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
            <div style={style.postbg} className="d-flex justify-content-center">
                <div style={style.postContainer} className="d-flex justify-content-center flex-column">
                    {post}
                </div>
            </div>
        </div>
    );
}

export default Feed;