const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const templates = {
  welcome: ({ name, tenantName }) => ({
    subject: `Welcome to Saree Tassels, ${name}!`,
    html: `<h2>Welcome, ${name}!</h2>
           <p>Your store <strong>${tenantName}</strong> has been created successfully.</p>
           <p>Log in to start adding products and managing orders.</p>`,
  }),
  resetPassword: ({ name, otp }) => ({
    subject: 'Password Reset OTP',
    html: `<h2>Hi ${name},</h2>
           <p>Your OTP for password reset is: <strong>${otp}</strong></p>
           <p>This OTP expires in 15 minutes.</p>`,
  }),
  orderUpdate: ({ orderId, status, note }) => ({
    subject: `Order #${orderId} — ${status}`,
    html: `<h2>Order Update</h2>
           <p>Your order <strong>#${orderId}</strong> status has been updated to <strong>${status}</strong>.</p>
           ${note ? `<p>Note: ${note}</p>` : ''}`,
  }),
  orderConfirmation: ({ orderId, totalAmount, items }) => ({
    subject: `Order Confirmed — #${orderId}`,
    html: `<h2>Your order is confirmed!</h2>
           <p>Order ID: <strong>${orderId}</strong></p>
           <p>Total: <strong>₹${totalAmount}</strong></p>`,
  }),
};

/**
 * sendEmail({ to, template, data }) — non-blocking helper
 */
const sendEmail = async ({ to, subject, template, data }) => {
  const tpl = templates[template]?.(data);
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: tpl?.subject || subject,
    html: tpl?.html || '',
  };
  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
