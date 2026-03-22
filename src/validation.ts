import {
  TaskStatus,
  CreateTaskDTO,
  UpdateTaskDTO,
} from './types';

import {
  TASK_TITLE_MIN_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
} from './constants';

import { ErrorCode, AppError, createAppError } from './errors';

export interface ValidationResult {
  valid: boolean;
  errors: AppError[];
}

export function validateCreateTask(dto: CreateTaskDTO): ValidationResult {
  const errors: AppError[] = [];

  if (!dto.title || dto.title.trim().length < TASK_TITLE_MIN_LENGTH) {
    errors.push(createAppError(ErrorCode.TITLE_REQUIRED, 'title'));
  }

  if (dto.title && dto.title.trim().length > TASK_TITLE_MAX_LENGTH) {
    errors.push(createAppError(ErrorCode.TITLE_TOO_LONG, 'title'));
  }

  if (
    dto.description &&
    dto.description.length > TASK_DESCRIPTION_MAX_LENGTH
  ) {
    errors.push(createAppError(ErrorCode.DESCRIPTION_TOO_LONG, 'description'));
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdateTask(dto: UpdateTaskDTO): ValidationResult {
  const errors: AppError[] = [];

  if (dto.title !== undefined) {
    if (!dto.title || dto.title.trim().length < TASK_TITLE_MIN_LENGTH) {
      errors.push(createAppError(ErrorCode.TITLE_REQUIRED, 'title'));
    }
    if (dto.title && dto.title.trim().length > TASK_TITLE_MAX_LENGTH) {
      errors.push(createAppError(ErrorCode.TITLE_TOO_LONG, 'title'));
    }
  }

  if (
    dto.description !== undefined &&
    dto.description !== null &&
    dto.description.length > TASK_DESCRIPTION_MAX_LENGTH
  ) {
    errors.push(createAppError(ErrorCode.DESCRIPTION_TOO_LONG, 'description'));
  }

  if (dto.status !== undefined) {
    if (!Object.values(TaskStatus).includes(dto.status)) {
      errors.push(createAppError(ErrorCode.INVALID_STATUS, 'status'));
    }
  }

  return { valid: errors.length === 0, errors };
}

export function isValidTaskStatus(status: string): status is TaskStatus {
  return Object.values(TaskStatus).includes(status as TaskStatus);
}
