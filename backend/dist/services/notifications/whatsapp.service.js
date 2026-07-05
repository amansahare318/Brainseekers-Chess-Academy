"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappService = exports.PlaceholderWhatsAppService = void 0;
/** Placeholder — wire WhatsApp Business API in production */
class PlaceholderWhatsAppService {
    async sendWhatsApp(payload) {
        console.log('[WhatsAppService:placeholder]', { to: payload.to, body: payload.body });
    }
}
exports.PlaceholderWhatsAppService = PlaceholderWhatsAppService;
exports.whatsappService = new PlaceholderWhatsAppService();
