import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (error) {
    console.error("Failed to initialize Twilio client:", error);
  }
}

export const sendWhatsAppMessage = async ({ to, message }) => {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn("WhatsApp not sent: Twilio credentials missing in .env");
    return null;
  }

  try {
    // Twilio WhatsApp numbers must be prefixed with 'whatsapp:'
    const from = process.env.TWILIO_PHONE_NUMBER.startsWith("whatsapp:") 
      ? process.env.TWILIO_PHONE_NUMBER 
      : `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;
      
    // Destination number must also be prefixed with 'whatsapp:' and include country code
    const toFormatted = to.startsWith("whatsapp:") 
      ? to 
      : `whatsapp:${to.startsWith('+') ? to : '+91' + to}`;

    const response = await twilioClient.messages.create({
      body: message,
      from,
      to: toFormatted
    });
    
    console.log("WhatsApp sent: %s", response.sid);
    return response;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    // Don't throw to avoid crashing the main request flow
    return null;
  }
};
