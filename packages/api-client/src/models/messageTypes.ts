export type sendToUserResponseType = {
  id: number;
  user_nicename: string;
  user_email: string;
  display_name: string;
  user_status: number;
};

export type sendToUserType = {
  id: number;
  userName: string;
  userEmail: string;
  displayName: string;
  userStatus: number;
};

export type buyerSignupPayloadType = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  isAgree: boolean;
};
