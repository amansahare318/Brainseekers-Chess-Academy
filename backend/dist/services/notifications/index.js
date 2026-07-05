"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationServices = exports.whatsappService = exports.smsService = exports.emailService = void 0;
__exportStar(require("./types"), exports);
var email_service_1 = require("./email.service");
Object.defineProperty(exports, "emailService", { enumerable: true, get: function () { return email_service_1.emailService; } });
var sms_service_1 = require("./sms.service");
Object.defineProperty(exports, "smsService", { enumerable: true, get: function () { return sms_service_1.smsService; } });
var whatsapp_service_1 = require("./whatsapp.service");
Object.defineProperty(exports, "whatsappService", { enumerable: true, get: function () { return whatsapp_service_1.whatsappService; } });
const email_service_2 = require("./email.service");
const sms_service_2 = require("./sms.service");
const whatsapp_service_2 = require("./whatsapp.service");
exports.notificationServices = {
    email: email_service_2.emailService,
    sms: sms_service_2.smsService,
    whatsapp: whatsapp_service_2.whatsappService,
};
