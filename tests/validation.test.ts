import {
  validateCreateTask,
  validateUpdateTask,
  isValidTaskStatus,
} from '../src/validation';

import { TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../src/types';
import { ErrorCode } from '../src/errors';
import {
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
} from '../src/constants';

describe('validateCreateTask', () => {
  it('should pass with valid title', () => {
    const result = validateCreateTask({ title: 'Buy groceries' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should pass with title and description', () => {
    const result = validateCreateTask({
      title: 'Buy groceries',
      description: 'Milk, eggs, bread',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail when title is empty string', () => {
    const result = validateCreateTask({ title: '' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ErrorCode.TITLE_REQUIRED);
    expect(result.errors[0].field).toBe('title');
  });

  it('should fail when title is whitespace only', () => {
    const result = validateCreateTask({ title: '   ' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ErrorCode.TITLE_REQUIRED);
  });

  it('should fail when title exceeds max length', () => {
    const result = validateCreateTask({
      title: 'a'.repeat(TASK_TITLE_MAX_LENGTH + 1),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === ErrorCode.TITLE_TOO_LONG)).toBe(
      true,
    );
  });

  it('should fail when description exceeds max length', () => {
    const result = validateCreateTask({
      title: 'Valid title',
      description: 'a'.repeat(TASK_DESCRIPTION_MAX_LENGTH + 1),
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.code === ErrorCode.DESCRIPTION_TOO_LONG),
    ).toBe(true);
  });

  it('should return multiple errors for multiple violations', () => {
    const result = validateCreateTask({
      title: 'a'.repeat(TASK_TITLE_MAX_LENGTH + 1),
      description: 'a'.repeat(TASK_DESCRIPTION_MAX_LENGTH + 1),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should include human-friendly messages in errors', () => {
    const result = validateCreateTask({ title: '' });
    expect(result.errors[0].message).toBeTruthy();
    expect(result.errors[0].message.length).toBeGreaterThan(10);
  });
});

describe('validateUpdateTask', () => {
  it('should pass with valid title update', () => {
    const result = validateUpdateTask({ title: 'Updated title' });
    expect(result.valid).toBe(true);
  });

  it('should pass with valid status update', () => {
    const result = validateUpdateTask({ status: TaskStatus.IN_PROGRESS });
    expect(result.valid).toBe(true);
  });

  it('should pass with valid description update', () => {
    const result = validateUpdateTask({ description: 'Updated description' });
    expect(result.valid).toBe(true);
  });

  it('should pass with empty DTO (no fields to update)', () => {
    const result = validateUpdateTask({});
    expect(result.valid).toBe(true);
  });

  it('should fail when title is empty string', () => {
    const result = validateUpdateTask({ title: '' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ErrorCode.TITLE_REQUIRED);
  });

  it('should fail when title exceeds max length', () => {
    const result = validateUpdateTask({
      title: 'a'.repeat(TASK_TITLE_MAX_LENGTH + 1),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === ErrorCode.TITLE_TOO_LONG)).toBe(
      true,
    );
  });

  it('should fail when description exceeds max length', () => {
    const result = validateUpdateTask({
      description: 'a'.repeat(TASK_DESCRIPTION_MAX_LENGTH + 1),
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.code === ErrorCode.DESCRIPTION_TOO_LONG),
    ).toBe(true);
  });

  it('should fail for invalid status', () => {
    const result = validateUpdateTask({
      status: 'INVALID' as TaskStatus,
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.code === ErrorCode.INVALID_STATUS),
    ).toBe(true);
  });

  it('should allow null description', () => {
    const result = validateUpdateTask({ description: null as unknown as string });
    expect(result.valid).toBe(true);
  });
});

describe('isValidTaskStatus', () => {
  it('should return true for TODO', () => {
    expect(isValidTaskStatus('TODO')).toBe(true);
  });

  it('should return true for IN_PROGRESS', () => {
    expect(isValidTaskStatus('IN_PROGRESS')).toBe(true);
  });

  it('should return true for DONE', () => {
    expect(isValidTaskStatus('DONE')).toBe(true);
  });

  it('should return false for invalid status', () => {
    expect(isValidTaskStatus('PENDING')).toBe(false);
    expect(isValidTaskStatus('invalid')).toBe(false);
    expect(isValidTaskStatus('')).toBe(false);
  });
});
