"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorii = void 0;
// Importăm config-ul JSON cu toate categoriile și subcategoriile
// (asigură validarea tipurilor la runtime și la build)
// @ts-ignore
const categories_json_1 = __importDefault(require("./categories.json"));
exports.categorii = categories_json_1.default;
