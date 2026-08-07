import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { emitNotification } from "../socket/socket.js";
import { sendEmail, getOrderTemplate } from "../services/email.service.js";
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";

export const sendNotification = async ({
  userId,
  title,
  message,
  type = "system",
  link = "",
  metadata = {},
  sendEmailFlag = false,
  sendWhatsappFlag = false,
  phone = "",
  order = null
}) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    link,
    metadata,
  });

  // 1. In-app Socket.io notification
  emitNotification(userId, notification);

  // 2. External Notifications (Async so they don't block)
  if (sendEmailFlag || sendWhatsappFlag) {
    (async () => {
      try {
        const user = await User.findById(userId);
        if (user) {
          // Send Email
          if (sendEmailFlag && user.email) {
            let html = `<p>${message}</p>`;
            if (order) {
              html = getOrderTemplate(order, title);
            }
            await sendEmail({ to: user.email, subject: title, html });
          }
          
          // Send WhatsApp
          if (sendWhatsappFlag) {
            const destPhone = phone || (user.addresses && user.addresses.length > 0 ? user.addresses[0].phone : null);
            if (destPhone) {
              await sendWhatsAppMessage({ to: destPhone, message: `${title}\n\n${message}` });
            }
          }
        }
      } catch (error) {
        console.error("Failed to send external notifications:", error);
      }
    })();
  }

  return notification;
};
