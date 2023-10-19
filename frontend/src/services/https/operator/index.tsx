import { OperatorsInterface } from "../../../interfaces/IOperator";

const apiUrl = "http://localhost:8080";

async function GetOperators(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/operator/${id}`, requestOptions)
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

async function DeleteOperator(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE",
  };

  let res = await fetch(`${apiUrl}/operator/${id}`, requestOptions)
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

async function CreateOperator(data: OperatorsInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/operators`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else if (res.error.includes("อีเมลนี้มีผู้ใช้แล้ว")) {
        return { status: false, message: "อีเมลนี้มีผู้ใช้แล้ว" };
      } else {
        return { status: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
      }
    })
    .catch((error) => {
      console.error(error);
      return { status: false, message: "เกิดข้อผิดพลาดในการส่งคำขอ" };
    });

  return res;
}

async function OperatorLogin(data: OperatorsInterface) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(`${apiUrl}/operators/login`, requestOptions);

    if (response.ok) {
      const loginResponse = await response.json();
      return loginResponse;
    } else {
      console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", response.status);
      return null;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", error);
    return null;
  }
}

async function UpdateOperator(data: OperatorsInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/operators`, requestOptions)
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

async function UpdatePrivacyOperator(data: OperatorsInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/operators/privacy`, requestOptions)
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
  GetOperators,
  CreateOperator,
  OperatorLogin,
  UpdateOperator,
  UpdatePrivacyOperator,
  DeleteOperator,
};
