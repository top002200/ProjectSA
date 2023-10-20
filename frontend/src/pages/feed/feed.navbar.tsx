import logo from "../../public/jobjob.png";
import person1 from "../../public/person1.jpg";
import { style } from "./feedcss"
import { SearchWork } from "../../services/https/feed.service"
import { useEffect, useState, KeyboardEvent } from "react";
import { log } from "console";


function FeedNavbar() {

    const [key, setKey] = useState(''); // State to store the input value
    const [response, setResponse] = useState(null); // State to store the response

    const handleEnterKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const inputValue = event.currentTarget.value;
            setKey(inputValue); // Update the "key" state with the input value

            try {
                const result = await SearchWork(inputValue);
                setResponse(result);
                console.log(result);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Example useEffect to demonstrate using the response state:
    useEffect(() => {
        if (response !== null) {
            // Do something with the response
        }
    }, [response]);

    return (
        <div className='d-flex justify-content-between align-items-center sticky-top' style={style.nav}>
            <div className="d-flex">
                <a href="">
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
    );


}
export default FeedNavbar;