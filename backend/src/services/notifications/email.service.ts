import { EmailService, NotificationPayload } from './types';

/** Placeholder — wire SendGrid/SES/Nodemailer in production */
export class PlaceholderEmailService implements EmailService {
  async sendEmail(payload: NotificationPayload): Promise<void> {
    console.log('[EmailService:placeholder]', {
      to: payload.to,
      subject: payload.subject,
      preview: payload.body.slice(0, 80),
    });
  }
}

export const emailService = new PlaceholderEmailService();
