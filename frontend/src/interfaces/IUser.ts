export interface UsersInterface {
    ID?: number;
    Avatar?: string
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
    PassOrRejectionDetails?: string;
    Read?: boolean;
    Position?: string;
    Salary?: number;
    Description?: string;
    Topic?: string,
    StatusNoti?: string,
    Com_name?: string,
}

