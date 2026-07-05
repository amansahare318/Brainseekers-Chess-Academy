import { WhatsAppService, NotificationPayload } from './types';

/** Placeholder — wire WhatsApp Business API in production */
export class PlaceholderWhatsAppService implements WhatsAppService {
  async sendWhatsApp(payload: NotificationPayload): Promise<void> {
    console.log('[WhatsAppService:placeholder]', { to: payload.to, body: payload.body });
  }
}

export const whatsappService = new PlaceholderWhatsAppService();
