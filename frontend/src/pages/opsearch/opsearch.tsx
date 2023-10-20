import sut from "../../public/sut.png";
import logo from "../../public/jobjob.png";

import person1 from "../../public/person1.jpg";
import { GetPost, UploadImage, GetLatestWHU } from "../../services/https/feed.service";
import { useEffect, useState, KeyboardEvent } from 'react';
import { style } from "./opsearchcss"
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Swal from 'sweetalert2'
import { message } from "antd";
import { CreateRegWork } from "../../services/https/feed.service";
import { useNavigate } from "react-router-dom";
import { SearchUser, GetUserHWU } from "../../services/https/opsearch.service"
import { Helmet } from 'react-helmet';
import exp from "constants";

function Opsearch() {

    // const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const userID = 123;


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

    // LogData
    const logData = () => {
        console.log("Post : " + data);
        console.log("Search : " + response);
    }

    // Register
    const createReg = async (post_id: number) => {
        console.log("Hiiiiii");
        let data = {
            Status: false,
            User_id: userID,
            PostID: post_id
        }
        console.log(data)
        let res = await CreateRegWork(data);
        if (res.status) {
            console.log("Create Success!!!")
            messageApi.open({
                type: "success",
                content: "บันทึกข้อมูลสำเร็จ",
            });
        } else {
            console.log("Create Error!!!")
            messageApi.open({
                type: "error",
                content: "บันทึกข้อมูลไม่สำเร็จ",
            });
        }
    }



    /// Post Gen
    const worker = [];
    console.log(response)
    for (let i = 1; i <= response.length; i++) {

        let newUser = response[i - 1]

        let name = newUser.Title_name+newUser.First_name+" "+newUser.Last_name
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

            <div className='d-flex justify-content-between align-items-center sticky-top' style={style.nav}>
                <div className="d-flex">
                    <a href="/">
                        <img src={logo} alt="" style={style.logo} />
                    </a>
                    <div>
                        <input
                            type="text"
                            id="searchWork"
                            style={style.searchbg}
                            onKeyPress={handleEnterKeyPress} // Add event listener
                        />
                    </div>
                </div>
                <div>
                    <a href="" style={{ textDecoration: "none" }}>
                        <div className='d-flex justify-content-between align-items-center' style={style.profilebg}>
                            <img src={person1} alt="" style={style.person} />
                            <div style={style.nameText}>Anuwat Passaphan</div>
                        </div>
                    </a>
                </div>
            </div>

            <div style={style.postbg} className="d-flex justify-content-center">
                <div style={style.postContainer} className="d-flex justify-content-center flex-column">
                    {worker}
                </div>
            </div>
        </div>
    );
}

export default Opsearch;