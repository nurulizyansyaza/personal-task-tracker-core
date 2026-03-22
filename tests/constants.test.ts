import {
  TASK_TITLE_MIN_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
} from '../src/constants';

describe('constants', () => {
  describe('task field limits', () => {
    it('should have valid title min length', () => {
      expect(TASK_TITLE_MIN_LENGTH).toBeGreaterThan(0);
      expect(typeof TASK_TITLE_MIN_LENGTH).toBe('number');
    });

    it('should have valid title max length', () => {
      expect(TASK_TITLE_MAX_LENGTH).toBeGreaterThan(TASK_TITLE_MIN_LENGTH);
      expect(typeof TASK_TITLE_MAX_LENGTH).toBe('number');
    });

    it('should have valid description max length', () => {
      expect(TASK_DESCRIPTION_MAX_LENGTH).toBeGreaterThan(0);
      expect(typeof TASK_DESCRIPTION_MAX_LENGTH).toBe('number');
    });

    it('should have reasonable limits', () => {
      expect(TASK_TITLE_MAX_LENGTH).toBeLessThanOrEqual(500);
      expect(TASK_DESCRIPTION_MAX_LENGTH).toBeLessThanOrEqual(10000);
    });
  });
});
