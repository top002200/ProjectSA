import { DataWHU } from "../../../interfaces";
// import { DataNotification } from "../../interfaces/Notification";

const apiUrl = "http://localhost:8080";



// async function CreateNotification(data: DataNotification) {
//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   };

//   let res = await fetch(`${apiUrl}/notification`, requestOptions)
//     .then((response) => response.json())
//     .then((res) => {
//       if (res.data) {
//         return { status: true, message: res.data };
//       } else {
//         return { status: false, message: res.error };
//       }
//     });
  
//   return res;
// }

async function CreateCandidate(data: DataWHU[]) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/createcandidates`, requestOptions);

    if (!response.ok) {
      // Handle HTTP error responses (e.g., 4xx or 5xx status codes)
      const errorMessage = `HTTP Error: ${response.status}`;
      return { status: false, message: errorMessage };
    }

    const responseData = await response.json();

    if (responseData.data) {
      // ส่งข้อมูลสำเร็จ
      return { status: true, message: responseData.data };
    } else {
      return { status: false, message: responseData.error };
    }
  } catch (error) {
    // Handle network errors, fetch() errors, etc.
    return { status: false, message: "An error occurred." };
  }
}




async function GetCandidate(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    let res = await fetch(`${apiUrl}/candidate/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } else {
          return false;
        }
      });
      
  
    return res;
}


async function UpdateWorkHasUser(data: DataWHU) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/users`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}
  
  
export {
    CreateCandidate,
    GetCandidate,
    UpdateWorkHasUser,
};
