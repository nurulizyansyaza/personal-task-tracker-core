import {
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
} from './constants';

export enum ErrorCode {
  // Validation
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  TITLE_REQUIRED = 'TITLE_REQUIRED',
  TITLE_TOO_LONG = 'TITLE_TOO_LONG',
  DESCRIPTION_TOO_LONG = 'DESCRIPTION_TOO_LONG',
  INVALID_STATUS = 'INVALID_STATUS',
  UNKNOWN_FIELDS = 'UNKNOWN_FIELDS',

  // Resource
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',

  // Server
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_FAILED]:
    'Please check your input and try again.',
  [ErrorCode.TITLE_REQUIRED]:
    'Every task needs a title. Please add one.',
  [ErrorCode.TITLE_TOO_LONG]:
    `Your title is too long. Please keep it under ${TASK_TITLE_MAX_LENGTH} characters.`,
  [ErrorCode.DESCRIPTION_TOO_LONG]:
    `Your description is too long. Please keep it under ${TASK_DESCRIPTION_MAX_LENGTH} characters.`,
  [ErrorCode.INVALID_STATUS]:
    "That status doesn't exist. Please use To Do, In Progress, or Done.",
  [ErrorCode.UNKNOWN_FIELDS]:
    'Your request contains fields we don\'t recognize. Please remove them and try again.',
  [ErrorCode.TASK_NOT_FOUND]:
    "We couldn't find that task. It may have been deleted.",
  [ErrorCode.DATABASE_ERROR]:
    'Something went wrong saving your data. Please try again in a moment.',
  [ErrorCode.INTERNAL_ERROR]:
    'Something unexpected happened. Please try again later.',
  [ErrorCode.RATE_LIMIT_EXCEEDED]:
    "You're making requests too quickly. Please wait a moment and try again.",
  [ErrorCode.SERVICE_UNAVAILABLE]:
    "We're having trouble connecting to the server. Please check your connection and try again.",
};

export interface AppError {
  code: ErrorCode;
  message: string;
  field?: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  errors?: AppError[];
  timestamp: string;
  path?: string;
}

export function createAppError(
  code: ErrorCode,
  field?: string,
  customMessage?: string,
): AppError {
  return {
    code,
    message: customMessage ?? ERROR_MESSAGES[code],
    ...(field && { field }),
  };
}

export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code];
}

export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as ApiErrorResponse).success === false &&
    'statusCode' in data
  );
}
