export interface NotificationPayload {
  to: string;
  subject?: string;
  body: string;
  metadata?: Record<string, string>;
}

export interface EmailService {
  sendEmail(payload: NotificationPayload): Promise<void>;
}

export interface SMSService {
  sendSMS(payload: NotificationPayload): Promise<void>;
}

export interface WhatsAppService {
  sendWhatsApp(payload: NotificationPayload): Promise<void>;
}
