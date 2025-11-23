// =========================== EMAIL TEMPLATES ===========================

export const verificationEmail = (name, url) => {
  const subject = "Verify Your Email Address";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Hello ${name},</h2>
      <p>Thank you for registering. Please verify your email by clicking the button below:</p>
      <a href="${url}" style="display:inline-block; padding: 10px 20px; margin-top: 10px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not create this account, please ignore this email.</p>
      <hr>
      <small>&copy; ${new Date().getFullYear()} FiraBoss. All rights reserved.</small>
    </div>
  `;
  const text = `Hello ${name},\n\nPlease verify your email: ${url}\n\nIf you did not create this account, ignore this email.`;
  return { subject, html, text };
};

export const resetPasswordEmail = (name, url) => {
  const subject = "Reset Your Password";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${url}" style="display:inline-block; padding: 10px 20px; margin-top: 10px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <hr>
      <small>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</small>
    </div>
  `;
  const text = `Hello ${name},\n\nReset your password using the following link: ${url}\n\nIf you did not request a password reset, ignore this email.`;
  return { subject, html, text };
};

export const notificationEmail = (
  name,
  message,
  actionURL = null,
  actionText = "View"
) => {
  const subject = "Notification from FiraBoss";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Hello ${name},</h2>
      <p>${message}</p>
      ${
        actionURL
          ? `<a href="${actionURL}" style="display:inline-block; padding: 10px 20px; margin-top: 10px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">${actionText}</a>`
          : ""
      }
      <hr>
      <small>&copy; ${new Date().getFullYear()} FiraBoss. All rights reserved.</small>
    </div>
  `;
  const text = `Hello ${name},\n\n${message}\n${
    actionURL ? `Action: ${actionURL}` : ""
  }`;
  return { subject, html, text };
};
