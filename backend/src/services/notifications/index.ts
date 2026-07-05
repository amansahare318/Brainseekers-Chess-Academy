export * from './types';
export { emailService } from './email.service';
export { smsService } from './sms.service';
export { whatsappService } from './whatsapp.service';

import { emailService } from './email.service';
import { smsService } from './sms.service';
import { whatsappService } from './whatsapp.service';

export const notificationServices = {
  email: emailService,
  sms: smsService,
  whatsapp: whatsappService,
};
