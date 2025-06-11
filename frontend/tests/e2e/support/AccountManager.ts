import { TestAccount } from '../types/test-types';
import { TEST_ACCOUNTS } from '../config/test-constants';

/**
 * Manager pentru conturile de test - simplu și direct
 */
export class AccountManager {
  /**
   * Obține contul principal de test
   */
  static getPrimaryAccount(): TestAccount {
    return TEST_ACCOUNTS.PRIMARY;
  }

  /**
   * Obține un cont de test (pentru acum returnează principal)
   */
  static getTestAccount(): TestAccount {
    return TEST_ACCOUNTS.PRIMARY;
  }

  /**
   * Cleanup simplu
   */
  static cleanup(): void {
    // Nu mai face nimic complicat
  }
} 