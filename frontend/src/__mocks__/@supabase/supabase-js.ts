/**
 * Mock general pentru @supabase/supabase-js folosind patternul Jest pentru module externe
 * Acest mock va fi folosit automat pentru toate importurile din @supabase/supabase-js
 * OWNER: echipa auth & testing
 */
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    then: jest.fn((callback) => Promise.resolve(callback({ data: [], error: null, count: 0 }))),
  })),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null }),
    getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'mock-user-id' } } }, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id' } }, error: null }),
    signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id' } }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
  storage: { from: jest.fn() },
  functions: { invoke: jest.fn() },
  channel: jest.fn(),
  realtime: { channel: jest.fn() }
};

// Exportăm funcția createClient care returnează mockClient-ul
// Acest export va intercepta toate apelurile la createClient din @supabase/supabase-js
export const createClient = jest.fn().mockImplementation(() => mockSupabaseClient);

// Export pentru compatibilitate cu ts
export class SupabaseClient {}
