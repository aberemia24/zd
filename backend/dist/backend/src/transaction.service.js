"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
let TransactionService = class TransactionService {
    constructor() {
        this.transactions = [];
    }
    getAll(params) {
        let result = [...this.transactions];
        if (params) {
            const { type, category, dateFrom, dateTo, limit, offset, sort } = params;
            if (type) {
                result = result.filter(t => t.type === type);
            }
            if (category) {
                result = result.filter(t => t.category === category);
            }
            if (dateFrom) {
                result = result.filter(t => t.date >= dateFrom);
            }
            if (dateTo) {
                result = result.filter(t => t.date <= dateTo);
            }
            if (sort) {
                const allowedFields = ['amount', 'date', 'id', 'category', 'type'];
                const field = sort.replace(/^-/, '');
                const desc = sort.startsWith('-');
                if (allowedFields.includes(field)) {
                    result = result.sort((a, b) => {
                        const aValue = a[field];
                        const bValue = b[field];
                        if (aValue === undefined && bValue === undefined)
                            return 0;
                        if (aValue === undefined)
                            return desc ? 1 : -1;
                        if (bValue === undefined)
                            return desc ? -1 : 1;
                        if (aValue < bValue)
                            return desc ? 1 : -1;
                        if (aValue > bValue)
                            return desc ? -1 : 1;
                        return 0;
                    });
                }
            }
            const total = result.length;
            const lim = limit ? parseInt(limit, 10) : 20;
            const off = offset ? parseInt(offset, 10) : 0;
            const data = result.slice(off, off + lim);
            return {
                data,
                total,
                limit: lim,
                offset: off,
            };
        }
        return {
            data: result,
            total: result.length,
            limit: result.length,
            offset: 0,
        };
    }
    getOne(id) {
        return this.transactions.find(t => t.id === id);
    }
    create(transaction) {
        this.transactions.push(transaction);
        return transaction;
    }
    update(id, transaction) {
        const idx = this.transactions.findIndex(t => t.id === id);
        if (idx === -1)
            return undefined;
        this.transactions[idx] = transaction;
        return transaction;
    }
    delete(id) {
        const idx = this.transactions.findIndex(t => t.id === id);
        if (idx === -1)
            return undefined;
        const [removed] = this.transactions.splice(idx, 1);
        return removed;
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)()
], TransactionService);
//# sourceMappingURL=transaction.service.js.map