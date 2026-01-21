import {ErrorDto, ValidationErrorDto} from './types.ts';

export const isValidationError = (err: ErrorDto | ValidationErrorDto): err is ValidationErrorDto => {
  return Object.hasOwn(err, 'details' satisfies keyof ValidationErrorDto);
};
