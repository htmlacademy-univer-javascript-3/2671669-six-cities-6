export type AuthSuccessResultDto = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
  email: string;
  token: string;
};

export type AuthErrorResultDto = {
  errorType: string;
  message: string;
  details: Array<{
    property: string;
    value: string;
    messages: string[];
  }>;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type UserData = AuthSuccessResultDto;
