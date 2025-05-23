"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
exports.API = {
    ROUTES: {
        TRANSACTIONS: '/transactions',
    },
    HEADERS: {
        CONTENT_TYPE: 'Content-Type',
        AUTHORIZATION: 'Authorization',
    },
    TIMEOUT: 10000,
    RETRY_LIMIT: 3,
    SUPABASE: {
        URL: process.env.SUPABASE_URL || 'https://pzyvibdgpfgohvewdmit.supabase.co',
        ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
};
//# sourceMappingURL=api.js.map