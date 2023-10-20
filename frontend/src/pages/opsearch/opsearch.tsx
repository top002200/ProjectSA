import sut from "../../public/sut.png";
import logo from "../../public/jobjob.png";

import person1 from "../../public/person1.jpg";
import { GetPost, UploadImage, GetLatestWHU } from "../../services/https/feed.service";
import { useEffect, useState, KeyboardEvent } from 'react';
import { style } from "./opsearchcss"
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Swal from 'sweetalert2'
import { Avatar, Button, Drawer, Row, message } from "antd";
import { CreateRegWork } from "../../services/https/feed.service";
import { Link, useNavigate } from "react-router-dom";
import { SearchUser, GetUserHWU } from "../../services/https/opsearch.service"
import { Helmet } from 'react-helmet';
import exp from "constants";
import { Footer, Header } from "antd/es/layout/layout";
import {
    SolutionOutlined,
    NotificationOutlined,
    LoginOutlined,
    MenuOutlined,
    IdcardOutlined,
    SafetyOutlined,
} from "@ant-design/icons";

function Opsearch() {

    // const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [openMenu, setMenuOpen] = useState(false);
    const [comname, setComname] = useState();

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

    const showDrawer = () => {
        setMenuOpen(true);
    };

    const onClose = () => {
        setMenuOpen(false);
    };


    // Get All Post
    const [data, setData] = useState([{
        "ID": 0,
        "Title_name": "",
        "First_name": "",
        "Last_name": "",
        "Experience": "",
        "Skill": ""
    }]);
    useEffect(() => {
        // สร้างฟังก์ชันสำหรับการดึง API
        const fetchData = async () => {
            try {
                const response = await GetUserHWU();
                console.log(response);
                if (!response) {
                    throw new Error('ไม่สามารถดึงข้อมูล API ได้');
                }
                const data = await response;
                // อัปเดตข้อมูลในตัวแปรสถานะ
                setData(data);
                setResponse(data)
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการดึง API:', error);
            }
        };
        fetchData();
    }, []);



    const [key, setKey] = useState(''); // State to store the input value
    const [response, setResponse] = useState(data); // State to store the response

    // Search
    const handleEnterKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            let inputValue = event.currentTarget.value;
            console.log("input = \"" + inputValue + "\"")
            setKey(inputValue); // Update the "key" state with the input value

            try {
                const response = await SearchUser(inputValue);
                setResponse(response);
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        }
    };


    /// Post Gen
    const worker = [];
    console.log(response)
    for (let i = 1; i <= response.length; i++) {

        let newUser = response[i - 1]

        let name = newUser.Title_name + newUser.First_name + " " + newUser.Last_name
        let skill = newUser.Skill
        let experience = newUser.Experience

        worker.push(
            <div>
                <div style={style.post}>
                    {/* POST Header */}
                    <div style={style.postHeader} className="d-flex justify-content-start">
                        {/* Left */}
                        <div style={style.customWidth}>
                            <div className="col d-flex flex-column bd-highlight mb-3 align-items-center justify-content-center">
                                <img src={sut} alt="" style={style.companylogo} />
                                <div>
                                    <div style={style.companyName}>
                                        {name}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className='col d-flex flex-column bd-highlight align-items-left justify-content-center'>
                            <div className="d-flex justify-content-start">
                                <div style={style.customWidthdes} className="d-flex flex-row-reverse bd-highlight">
                                    <b>ความสามารถ :</b>
                                </div>
                                {skill}
                            </div>
                            <div className="d-flex justify-content-start">
                                <div style={style.customWidthdes} className="d-flex flex-row-reverse bd-highlight">
                                    <b>ประสบการณ์ :</b>
                                </div>
                                {experience}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }


    return (
        <div>
            <Helmet>
                <title>JOBJOB : Search worker</title>
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
                    <div>
                        <input
                            type="text"
                            id="searchWork"
                            style={style.searchbg}
                            onKeyPress={handleEnterKeyPress} // Add event listener
                        />
                    </div>
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

            <div style={style.postbg} className="d-flex justify-content-center">
                <div style={style.postContainer} className="d-flex justify-content-center flex-column">
                    {worker}
                </div>
            </div>
        </div>
    );
}

export default Opsearch;