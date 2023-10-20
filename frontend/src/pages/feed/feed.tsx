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

function Feed() {

    // const navigate = useNavigate();
    // const [messageApi, contextHolder] = message.useMessage();
    const userID = Number(localStorage.getItem("id"))

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
              <input name="file" type="file" accept="image/jpeg, image/jpg"/>
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
                    handleReload()
                }
            }
        });
    };

    /// Post Gen
    const post = [];
    for (let i = 1; i <= response.length; i++) {

        let newpost = response[i - 1]
        console.log(response)
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
                    {post}
                </div>
            </div>
        </div>
    );
}

export default Feed;