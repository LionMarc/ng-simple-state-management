import { InjectionToken } from '@angular/core';

export interface RegexValidationResult {
  isValid: boolean;
  error?: string;
}

export interface RegexEditorValidator {
  validatePattern: (pattern: string) => RegexValidationResult;
  isMatch: (pattern: string, testString: string) => boolean;
}

export const NGSSM_REGEX_EDITOR_VALIDATOR = new InjectionToken<RegexEditorValidator>('NGSSM_NGSSM_REGEX_EDITOR_VALIDATORREDUCER');

export const defaultRegexEditorValidator: RegexEditorValidator = {
  validatePattern: (pattern: string) => {
    try {
      const regex = new RegExp(pattern);
      if (regex.test('')) {
        return { isValid: true };
      }
    } catch (error) {
      return { isValid: false, error: (error as Error).message };
    }

    return { isValid: true };
  },
  isMatch: (pattern: string, testString: string) => {
    try {
      const regex = new RegExp(pattern);
      if (regex.test(testString)) {
        return true;
      }
    } catch {
      return false;
    }

    return false;
  }
};
