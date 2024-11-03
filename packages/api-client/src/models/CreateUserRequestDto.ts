export interface CreateUserRequestDto {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  websiteUrl: string;
  password: string;
}
export interface LoginUserRequestDto {
  email: string;
  password: string;
}

export interface SocialLoginUserRequestDto {
  email: string;
}

function CreateUserRequestDtoFromJSONTyped(json: any): CreateUserRequestDto {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    userName: json["userName"],
    email: json["email"],
    password: json["password"],
    firstName: json["firstName"],
    lastName: json["lastName"],
    websiteUrl: json["websiteUrl"],
  };
}

export function CreateUserRequestDtoFromJSON(json: any): CreateUserRequestDto {
  return CreateUserRequestDtoFromJSONTyped(json);
}
