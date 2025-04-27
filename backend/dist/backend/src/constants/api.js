"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
exports.API = {
    ROUTES: {
        TRANSACTIONS: '/transactions',
    },
    QUERY_PARAMS: {
        TYPE: 'type',
        CATEGORY: 'category',
        DATE_FROM: 'dateFrom',
        DATE_TO: 'dateTo',
        LIMIT: 'limit',
        OFFSET: 'offset',
        SORT: 'sort',
    },
    HEADERS: {
        CONTENT_TYPE: 'Content-Type',
        AUTHORIZATION: 'Authorization',
    },
    TIMEOUT: 10000,
    RETRY_LIMIT: 3,
};
//# sourceMappingURL=api.js.map