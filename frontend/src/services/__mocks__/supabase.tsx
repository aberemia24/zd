/**
 * Mock complet pentru Supabase client - folosit de Jest automat dacă există în folder __mocks__
 * OWNER: echipa API & auth
 */
import { SupabaseClient } from "@supabase/supabase-js";

// Tip de date pentru rezultate Supabase
type SupabaseResult = {
  data: unknown | null;
  error: Error | null;
  count?: number;
};

// Tip de date pentru toate metodele chainable în mockuri
interface ChainableMock {
  // Metode query
  select: jest.Mock<ChainableMock>;
  insert: jest.Mock<ChainableMock>;
  update: jest.Mock<ChainableMock>;
  delete: jest.Mock<ChainableMock>;
  upsert: jest.Mock<ChainableMock>;

  // Metode de filtrare
  eq: jest.Mock<ChainableMock>;
  neq: jest.Mock<ChainableMock>;
  gt: jest.Mock<ChainableMock>;
  lt: jest.Mock<ChainableMock>;
  gte: jest.Mock<ChainableMock>;
  lte: jest.Mock<ChainableMock>;
  in: jest.Mock<ChainableMock>;
  is: jest.Mock<ChainableMock>;
  match: jest.Mock<ChainableMock>;
  not: jest.Mock<ChainableMock>;
  or: jest.Mock<ChainableMock>;
  filter: jest.Mock<ChainableMock>;

  // Metode query params
  limit: jest.Mock<ChainableMock>;
  range: jest.Mock<ChainableMock>;
  single: jest.Mock<ChainableMock>;
  maybeSingle: jest.Mock<ChainableMock>;
  order: jest.Mock<ChainableMock>;

  // Metode pentru promisiune
  then: jest.Mock<Promise<SupabaseResult>>;

  // Helper pentru mockuri în teste
  mockReturnValue: (result: SupabaseResult) => ChainableMock;
}

// Helper pentru a crea un mock pentru metode înlănțuite (chaining)
const createChainableQueryMock = (): ChainableMock => {
  const defaultResult: SupabaseResult = { data: [], error: null, count: 0 };

  // Creăm obiectul părțial pentru a permite referire circulară
  const chainable = {} as ChainableMock;

  // Metode query
  chainable.select = jest.fn().mockReturnValue(chainable);
  chainable.insert = jest.fn().mockReturnValue(chainable);
  chainable.update = jest.fn().mockReturnValue(chainable);
  chainable.delete = jest.fn().mockReturnValue(chainable);
  chainable.upsert = jest.fn().mockReturnValue(chainable);

  // Metode de filtrare
  chainable.eq = jest.fn().mockReturnValue(chainable);
  chainable.neq = jest.fn().mockReturnValue(chainable);
  chainable.gt = jest.fn().mockReturnValue(chainable);
  chainable.lt = jest.fn().mockReturnValue(chainable);
  chainable.gte = jest.fn().mockReturnValue(chainable);
  chainable.lte = jest.fn().mockReturnValue(chainable);
  chainable.in = jest.fn().mockReturnValue(chainable);
  chainable.is = jest.fn().mockReturnValue(chainable);
  chainable.match = jest.fn().mockReturnValue(chainable);
  chainable.not = jest.fn().mockReturnValue(chainable);
  chainable.or = jest.fn().mockReturnValue(chainable);
  chainable.filter = jest.fn().mockReturnValue(chainable);

  // Metode query params
  chainable.limit = jest.fn().mockReturnValue(chainable);
  chainable.range = jest.fn().mockReturnValue(chainable);
  chainable.single = jest.fn().mockReturnValue(chainable);
  chainable.maybeSingle = jest.fn().mockReturnValue(chainable);
  chainable.order = jest.fn().mockReturnValue(chainable);

  // Simulare rezultat la final
  chainable.then = jest.fn().mockResolvedValue(defaultResult);

  // Helper pentru a modifica răspunsul în teste
  chainable.mockReturnValue = (result: SupabaseResult): ChainableMock => {
    chainable.then = jest.fn().mockResolvedValue(result);
    return chainable;
  };

  return chainable;
};

// Exportăm Supabase client direct ca să înlocuim exportul din sursa reală
// Acest mock va fi folosit automat de Jest când se importă 'supabase' din './services/supabase'
export const supabase: SupabaseClient = {
  from: jest.fn().mockImplementation(() => createChainableQueryMock()),
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: "mock-user-id", email: "mock@mock.com" } },
      error: null,
    }),
    getSession: jest.fn().mockResolvedValue({
      data: {
        session: { user: { id: "mock-user-id", email: "mock@mock.com" } },
      },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: {
        user: { id: "mock-user-id", email: "mock@mock.com" },
        session: {},
      },
      error: null,
    }),
    signUp: jest.fn().mockResolvedValue({
      data: {
        user: { id: "mock-user-id", email: "mock@mock.com" },
        session: {},
      },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn().mockReturnValue(() => {}),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
  },
  rpc: jest.fn().mockReturnValue({ data: [], error: null }),
  storage: { from: jest.fn() },
  channel: jest.fn(),
  // Adăugăm proprietăți necesare pentru a satisface interfața SupabaseClient
  functions: { invoke: jest.fn() },
  realtime: { channel: jest.fn() },
} as unknown as SupabaseClient;
