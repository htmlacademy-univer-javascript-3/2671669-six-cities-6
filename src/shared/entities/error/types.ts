export type ErrorDto = {
  errorType: string;
  message: string;
};

export type ValidationErrorDetail = {
  property: string;
  value: string;
  messages: string[];
};

export type ValidationErrorDto = ErrorDto & {details: ValidationErrorDetail[]};
