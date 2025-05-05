// Mock global pentru toate testele, asigură mockuri pentru toate testele
// Jest va apela acest fișier înainte de teste dacă e configurat în jest.config sau package.json

// 1. Mock pentru @supabase/supabase-js pentru a evita eroarea "supabaseUrl is required" și "Invalid URL"
// Acest mock va fi folosit automat când se importă createClient din @supabase/supabase-js
jest.mock('@supabase/supabase-js', () => {
  // Override URL constructor pentru teste
  // eslint-disable-next-line no-global-assign
  URL = function(url) {
    this.href = url;
    this.origin = 'https://mock.supabase.co';
    this.protocol = 'https:';
    this.username = '';
    this.password = '';
    this.host = 'mock.supabase.co';
    this.hostname = 'mock.supabase.co';
    this.port = '';
    this.pathname = '';
    this.hash = '';
    this.search = '';
    this.toString = () => this.href;
    this.toJSON = () => this.href;
  };
  
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
    }
  };
  
  return {
    // createClient preia URL-ul și key-ul dar returnează mereu mockClient
    createClient: jest.fn(() => mockSupabaseClient),
    SupabaseClient: jest.fn().mockImplementation(() => mockSupabaseClient)
  };
});

// 2. Asigură că importurile de supabase.ts funcționează corect
jest.mock('./src/services/supabase', () => ({
  supabase: {
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
    }
  }
}));

// Evită erori de tipuri când se folosesc in mock-uri
global.mockImplementation = jest.fn;
