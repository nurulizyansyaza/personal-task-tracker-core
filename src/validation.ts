import {
  TaskStatus,
  CreateTaskDTO,
  UpdateTaskDTO,
  TASK_TITLE_MIN_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
} from './index';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCreateTask(dto: CreateTaskDTO): ValidationResult {
  const errors: string[] = [];

  if (!dto.title || dto.title.trim().length < TASK_TITLE_MIN_LENGTH) {
    errors.push('Title is required and cannot be empty');
  }

  if (dto.title && dto.title.trim().length > TASK_TITLE_MAX_LENGTH) {
    errors.push(`Title must not exceed ${TASK_TITLE_MAX_LENGTH} characters`);
  }

  if (
    dto.description &&
    dto.description.length > TASK_DESCRIPTION_MAX_LENGTH
  ) {
    errors.push(
      `Description must not exceed ${TASK_DESCRIPTION_MAX_LENGTH} characters`,
    );
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdateTask(dto: UpdateTaskDTO): ValidationResult {
  const errors: string[] = [];

  if (dto.title !== undefined) {
    if (!dto.title || dto.title.trim().length < TASK_TITLE_MIN_LENGTH) {
      errors.push('Title cannot be empty');
    }
    if (dto.title && dto.title.trim().length > TASK_TITLE_MAX_LENGTH) {
      errors.push(`Title must not exceed ${TASK_TITLE_MAX_LENGTH} characters`);
    }
  }

  if (
    dto.description !== undefined &&
    dto.description !== null &&
    dto.description.length > TASK_DESCRIPTION_MAX_LENGTH
  ) {
    errors.push(
      `Description must not exceed ${TASK_DESCRIPTION_MAX_LENGTH} characters`,
    );
  }

  if (dto.status !== undefined) {
    if (!Object.values(TaskStatus).includes(dto.status)) {
      errors.push(
        `Invalid status. Must be one of: ${Object.values(TaskStatus).join(', ')}`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

export function isValidTaskStatus(status: string): status is TaskStatus {
  return Object.values(TaskStatus).includes(status as TaskStatus);
}
