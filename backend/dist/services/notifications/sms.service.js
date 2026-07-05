"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsService = exports.PlaceholderSMSService = void 0;
/** Placeholder — wire Twilio/MessageBird in production */
class PlaceholderSMSService {
    async sendSMS(payload) {
        console.log('[SMSService:placeholder]', { to: payload.to, body: payload.body });
    }
}
exports.PlaceholderSMSService = PlaceholderSMSService;
exports.smsService = new PlaceholderSMSService();
