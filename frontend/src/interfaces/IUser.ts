export interface UsersInterface {
    ID?: number;
    Title_name?: string;
    First_name?: string;
    Last_name?: string;
    User_email?: string;
    User_pass?: string;
    Experience?: string;
    Skill?: string;
    Address?: string;
}

export interface NotiInterface {
    ID?: number;
    Content?: string;
    Read?: boolean;
    Position?: string;
    Salary?: number;
    Description?: string;
    Jobpost: {
        ID?: number;
        Position?: string;
        Salary?: number;
        Description?: string;
    };
    User: {
        ID?: number;
        // เพิ่ม properties ที่ต้องการจากตาราง User ตามความจำเป็น
    };
}

