import { renderHook, act } from '@testing-library/react';
import { useFormValidation, transactionSchema, authSchema } from '../useFormValidation';

// Mock pentru shared-constants
jest.mock('@budget-app/shared-constants', () => ({
  VALIDATION_MESSAGES: {
    EMPTY_VALUE: 'Câmpul este obligatoriu',
    AMOUNT_REQUIRED: 'Suma este obligatorie',
    AMOUNT_MUST_BE_NUMBER: 'Suma trebuie să fie un număr',
    AMOUNT_MUST_BE_POSITIVE: 'Suma trebuie să fie pozitivă',
    AMOUNT_TOO_SMALL: 'Suma este prea mică',
    AMOUNT_TOO_LARGE: 'Suma este prea mare',
  },
  VALIDATION: {
    AMOUNT_MIN: 0.01,
    AMOUNT_MAX: 999999,
    DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/,
  },
}));

describe('useFormValidation', () => {
  describe('basic functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useFormValidation({
          defaultValues: { test: 'value' },
        })
      );

      expect(result.current.getValues()).toEqual({ test: 'value' });
      expect(result.current.isFormValid).toBe(false); // Not dirty initially
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should provide helper functions for component props', () => {
      const { result } = renderHook(() =>
        useFormValidation({
          defaultValues: { test: '' },
        })
      );

      const inputProps = result.current.getInputProps('test' as any);
      const selectProps = result.current.getSelectProps('test' as any);
      const checkboxProps = result.current.getCheckboxProps('test' as any);
      const textareaProps = result.current.getTextareaProps('test' as any);

      expect(inputProps).toHaveProperty('error');
      expect(selectProps).toHaveProperty('error');
      expect(checkboxProps).toHaveProperty('error');
      expect(textareaProps).toHaveProperty('error');
    });

    it('should handle form submission', async () => {
      const onSubmitSuccess = jest.fn();
      const onSubmitError = jest.fn();

      const { result } = renderHook(() =>
        useFormValidation({
          defaultValues: { test: 'value' },
          onSubmitSuccess,
          onSubmitError,
        })
      );

      await act(async () => {
        await result.current.handleFormSubmit();
      });

      expect(onSubmitSuccess).toHaveBeenCalledWith({ test: 'value' });
      expect(onSubmitError).not.toHaveBeenCalled();
    });

    it('should handle form submission errors', async () => {
      const onSubmitSuccess = jest.fn().mockRejectedValue(new Error('Test error'));
      const onSubmitError = jest.fn();

      const { result } = renderHook(() =>
        useFormValidation({
          defaultValues: { test: 'value' },
          onSubmitSuccess,
          onSubmitError,
        })
      );

      await act(async () => {
        await result.current.handleFormSubmit();
      });

      expect(onSubmitSuccess).toHaveBeenCalledWith({ test: 'value' });
      expect(onSubmitError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('transaction schema validation', () => {
    it('should validate required fields', () => {
      const data = {
        type: '',
        amount: '',
        category: '',
        date: '',
      };

      const result = transactionSchema.safeParse(data);
      expect(result.success).toBe(false);
      
      // Pentru a accesa erorile, folosim type assertion după verificarea că este false
      const errorResult = result as { success: false; error: { issues: Array<{ path: Array<string | number> }> } };
      const errorPaths = errorResult.error.issues.map(issue => issue.path[0]);
      
      expect(errorPaths).toContain('type');
      expect(errorPaths).toContain('amount');
      expect(errorPaths).toContain('category');
      expect(errorPaths).toContain('date');
    });

    it('should validate amount as positive number', () => {
      const validData = {
        type: 'EXPENSE',
        amount: '100.50',
        category: 'FOOD',
        date: '2023-12-01',
      };

      const invalidData = {
        type: 'EXPENSE',
        amount: '-50',
        category: 'FOOD',
        date: '2023-12-01',
      };

      expect(transactionSchema.safeParse(validData).success).toBe(true);
      expect(transactionSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should validate date format', () => {
      const validData = {
        type: 'EXPENSE',
        amount: '100',
        category: 'FOOD',
        date: '2023-12-01',
      };

      const invalidData = {
        type: 'EXPENSE',
        amount: '100',
        category: 'FOOD',
        date: '01/12/2023',
      };

      expect(transactionSchema.safeParse(validData).success).toBe(true);
      expect(transactionSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should validate recurring frequency requirement', () => {
      const dataWithRecurringButNoFrequency = {
        type: 'EXPENSE',
        amount: '100',
        category: 'FOOD',
        date: '2023-12-01',
        recurring: true,
        frequency: '',
      };

      const dataWithRecurringAndFrequency = {
        type: 'EXPENSE',
        amount: '100',
        category: 'FOOD',
        date: '2023-12-01',
        recurring: true,
        frequency: 'MONTHLY',
      };

      expect(transactionSchema.safeParse(dataWithRecurringButNoFrequency).success).toBe(false);
      expect(transactionSchema.safeParse(dataWithRecurringAndFrequency).success).toBe(true);
    });

    it('should allow optional fields', () => {
      const minimalData = {
        type: 'EXPENSE',
        amount: '100',
        category: 'FOOD',
        date: '2023-12-01',
      };

      const dataWithOptionals = {
        ...minimalData,
        description: 'Test description',
        subcategory: 'Restaurant',
        recurring: false,
      };

      expect(transactionSchema.safeParse(minimalData).success).toBe(true);
      expect(transactionSchema.safeParse(dataWithOptionals).success).toBe(true);
    });
  });

  describe('auth schema validation', () => {
    it('should validate email format', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      expect(authSchema.safeParse(validData).success).toBe(true);
      expect(authSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should validate password length', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const invalidData = {
        email: 'test@example.com',
        password: '123',
      };

      expect(authSchema.safeParse(validData).success).toBe(true);
      expect(authSchema.safeParse(invalidData).success).toBe(false);
    });

    it('should validate password confirmation', () => {
      const matchingPasswords = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const nonMatchingPasswords = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      };

      expect(authSchema.safeParse(matchingPasswords).success).toBe(true);
      expect(authSchema.safeParse(nonMatchingPasswords).success).toBe(false);
    });

    it('should allow optional confirmPassword', () => {
      const dataWithoutConfirm = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(authSchema.safeParse(dataWithoutConfirm).success).toBe(true);
    });
  });
}); 
