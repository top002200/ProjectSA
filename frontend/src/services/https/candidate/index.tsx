import { CandidateInterface } from "../../../interfaces/ICandidate";

const apiUrl = "http://localhost:8080";


// async function GetUsers() {
//   const requestOptions = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   let res = await fetch(`${apiUrl}/candidateposts`, requestOptions)
//     .then((response) => response.json())
//     .then((res) => {
//       if (res.data) {
//         return res.data;
//       } else {
//         return false;
//       }
//     });

//   return res;
// }

async function CreateCandidatepost(data: CandidateInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/candidateposts`, requestOptions)
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
export interface DataType {
  ID: number;
  Position: string;
  Salary: string;
  Dsecrition: string;
  // Posttimestamp?: string;
  Topic: string;
  Address: string;
}

async function GetCandidatepost(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/candidatepost/${id}`, requestOptions)
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
async function DeletePost(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE"
  };

  let res = await fetch(`${apiUrl}/candidateposts/delete/${id}`, requestOptions)
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
    
export {
  // GetUsers,
  CreateCandidatepost,
  GetCandidatepost,
  DeletePost,
};
