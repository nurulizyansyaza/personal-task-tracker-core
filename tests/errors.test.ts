import {
  ErrorCode,
  ERROR_MESSAGES,
  createAppError,
  getErrorMessage,
  isApiErrorResponse,
  AppError,
  ApiErrorResponse,
} from '../src/errors';

import {
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
} from '../src/constants';

describe('ErrorCode', () => {
  it('should have all expected error codes', () => {
    expect(ErrorCode.VALIDATION_FAILED).toBe('VALIDATION_FAILED');
    expect(ErrorCode.TITLE_REQUIRED).toBe('TITLE_REQUIRED');
    expect(ErrorCode.TITLE_TOO_LONG).toBe('TITLE_TOO_LONG');
    expect(ErrorCode.DESCRIPTION_TOO_LONG).toBe('DESCRIPTION_TOO_LONG');
    expect(ErrorCode.INVALID_STATUS).toBe('INVALID_STATUS');
    expect(ErrorCode.UNKNOWN_FIELDS).toBe('UNKNOWN_FIELDS');
    expect(ErrorCode.TASK_NOT_FOUND).toBe('TASK_NOT_FOUND');
    expect(ErrorCode.DATABASE_ERROR).toBe('DATABASE_ERROR');
    expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    expect(ErrorCode.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED');
    expect(ErrorCode.SERVICE_UNAVAILABLE).toBe('SERVICE_UNAVAILABLE');
  });
});

describe('ERROR_MESSAGES', () => {
  it('should have a message for every ErrorCode', () => {
    const codes = Object.values(ErrorCode);
    codes.forEach((code) => {
      expect(ERROR_MESSAGES[code]).toBeDefined();
      expect(typeof ERROR_MESSAGES[code]).toBe('string');
      expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
    });
  });

  it('should include dynamic length limits in messages', () => {
    expect(ERROR_MESSAGES[ErrorCode.TITLE_TOO_LONG]).toContain(
      String(TASK_TITLE_MAX_LENGTH),
    );
    expect(ERROR_MESSAGES[ErrorCode.DESCRIPTION_TOO_LONG]).toContain(
      String(TASK_DESCRIPTION_MAX_LENGTH),
    );
  });

  it('should have user-friendly language (no technical jargon)', () => {
    Object.values(ERROR_MESSAGES).forEach((msg) => {
      expect(msg).not.toMatch(/exception|stack|null|undefined|NaN/i);
    });
  });
});

describe('createAppError', () => {
  it('should create error with default message', () => {
    const error = createAppError(ErrorCode.TITLE_REQUIRED);
    expect(error).toEqual({
      code: ErrorCode.TITLE_REQUIRED,
      message: ERROR_MESSAGES[ErrorCode.TITLE_REQUIRED],
    });
  });

  it('should create error with field', () => {
    const error = createAppError(ErrorCode.TITLE_REQUIRED, 'title');
    expect(error).toEqual({
      code: ErrorCode.TITLE_REQUIRED,
      message: ERROR_MESSAGES[ErrorCode.TITLE_REQUIRED],
      field: 'title',
    });
  });

  it('should create error with custom message', () => {
    const error = createAppError(
      ErrorCode.VALIDATION_FAILED,
      undefined,
      'Custom message',
    );
    expect(error.message).toBe('Custom message');
    expect(error.field).toBeUndefined();
  });

  it('should create error with both field and custom message', () => {
    const error = createAppError(
      ErrorCode.TITLE_TOO_LONG,
      'title',
      'Title is way too long!',
    );
    expect(error).toEqual({
      code: ErrorCode.TITLE_TOO_LONG,
      message: 'Title is way too long!',
      field: 'title',
    });
  });

  it('should not include field key when field is undefined', () => {
    const error = createAppError(ErrorCode.INTERNAL_ERROR);
    expect('field' in error).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('should return the correct message for each code', () => {
    expect(getErrorMessage(ErrorCode.TASK_NOT_FOUND)).toBe(
      ERROR_MESSAGES[ErrorCode.TASK_NOT_FOUND],
    );
    expect(getErrorMessage(ErrorCode.RATE_LIMIT_EXCEEDED)).toBe(
      ERROR_MESSAGES[ErrorCode.RATE_LIMIT_EXCEEDED],
    );
  });
});

describe('isApiErrorResponse', () => {
  it('should return true for valid error response', () => {
    const response: ApiErrorResponse = {
      success: false,
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      timestamp: new Date().toISOString(),
    };
    expect(isApiErrorResponse(response)).toBe(true);
  });

  it('should return true for error response with errors array', () => {
    const response: ApiErrorResponse = {
      success: false,
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'Validation failed',
      errors: [
        {
          code: ErrorCode.TITLE_REQUIRED,
          message: ERROR_MESSAGES[ErrorCode.TITLE_REQUIRED],
          field: 'title',
        },
      ],
      timestamp: new Date().toISOString(),
      path: '/tasks',
    };
    expect(isApiErrorResponse(response)).toBe(true);
  });

  it('should return false for success response', () => {
    expect(isApiErrorResponse({ success: true, data: {} })).toBe(false);
  });

  it('should return false for null/undefined', () => {
    expect(isApiErrorResponse(null)).toBe(false);
    expect(isApiErrorResponse(undefined)).toBe(false);
  });

  it('should return false for non-object', () => {
    expect(isApiErrorResponse('string')).toBe(false);
    expect(isApiErrorResponse(42)).toBe(false);
  });

  it('should return false for object missing statusCode', () => {
    expect(isApiErrorResponse({ success: false })).toBe(false);
  });
});
