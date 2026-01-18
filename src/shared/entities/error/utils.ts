import {ErrorDto, ValidationErrorDto} from './types.ts';

export const isValidationError = (err: ErrorDto | ValidationErrorDto): err is ValidationErrorDto => Object.hasOwn(err, 'details' satisfies keyof ValidationErrorDto);
