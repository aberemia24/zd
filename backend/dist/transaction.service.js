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
    getAll() {
        return this.transactions;
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
            throw new Error('Transaction not found');
        this.transactions[idx] = transaction;
        return transaction;
    }
    delete(id) {
        const idx = this.transactions.findIndex(t => t.id === id);
        if (idx === -1)
            throw new Error('Transaction not found');
        const [removed] = this.transactions.splice(idx, 1);
        return removed;
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)()
], TransactionService);
//# sourceMappingURL=transaction.service.js.map