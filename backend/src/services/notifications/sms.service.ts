import { SMSService, NotificationPayload } from './types';

/** Placeholder — wire Twilio/MessageBird in production */
export class PlaceholderSMSService implements SMSService {
  async sendSMS(payload: NotificationPayload): Promise<void> {
    console.log('[SMSService:placeholder]', { to: payload.to, body: payload.body });
  }
}

export const smsService = new PlaceholderSMSService();
