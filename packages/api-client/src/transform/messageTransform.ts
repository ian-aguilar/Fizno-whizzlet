import { sendToUserResponseType, sendToUserType } from "../models/messageTypes";

export const transformSendToUser = (
  data: sendToUserResponseType
): sendToUserType => {
  return {
    displayName: data.display_name,
    id: data.id,
    userEmail: data.user_email,
    userName: data.user_nicename,
    userStatus: data.user_status,
  };
};
