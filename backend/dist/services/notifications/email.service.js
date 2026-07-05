"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.PlaceholderEmailService = void 0;
/** Placeholder — wire SendGrid/SES/Nodemailer in production */
class PlaceholderEmailService {
    async sendEmail(payload) {
        console.log('[EmailService:placeholder]', {
            to: payload.to,
            subject: payload.subject,
            preview: payload.body.slice(0, 80),
        });
    }
}
exports.PlaceholderEmailService = PlaceholderEmailService;
exports.emailService = new PlaceholderEmailService();
