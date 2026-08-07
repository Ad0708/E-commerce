import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Email not sent: SMTP_USER or SMTP_PASS is missing in .env");
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.STORE_NAME || 'E-Commerce Store'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw to avoid crashing the main request flow
    return null;
  }
};

export const getOrderTemplate = (order, title) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">${title}</h2>
      <p style="color: #555;">Order ID: <strong>${order.orderNumber}</strong></p>
      <p style="color: #555;">Status: <strong>${order.status}</strong></p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${item.discountPrice > 0 ? item.discountPrice : item.price}</td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${order.summary.total}</td>
          </tr>
        </tfoot>
      </table>
      
      <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">
        Thank you for shopping with us!
      </p>
    </div>
  `;
};

export const getResetPasswordTemplate = (resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
      <p style="color: #555;">You requested a password reset. Please click the button below to set a new password.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #555;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">
        This link is valid for 15 minutes.
      </p>
    </div>
  `;
};
