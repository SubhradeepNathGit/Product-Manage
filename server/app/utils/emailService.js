const sendEmail = require('./sendEmail');

/**
 * Send employee welcome email with credentials
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Employee name
 * @param {string} params.employeeId - Generated employee ID
 * @param {string} params.password - Generated password
 */
const sendEmployeeWelcomeEmail = async ({ to, name, employeeId, password }) => {
  const message = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 1000px; margin: 0 auto; padding: 10px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
        <div style="background-color: #0377bfff; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">My Store</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 25px;">
              Welcome to the team! Your employee account has been created successfully. Below are your login credentials.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">Your Temporary Password</p>
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: rgb(20, 113, 184); background-color: #eff6ff; padding: 15px 30px; border-radius: 8px; border: 1px dashed rgb(150, 154, 164); display: inline-block;">
                ${password}
              </span>
            </div>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                <p style="margin: 5px 0; font-size: 14px; color: #374151;"><strong>Employee ID:</strong> ${employeeId}</p>
                <p style="margin: 5px 0; font-size: 14px; color: #374151;"><strong>Email:</strong> ${to}</p>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 30px;">
              Please change your password upon first login for security purposes.
            </p>

            <div style="text-align: center; margin-bottom: 30px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background-color: #0377bfff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Login to Your Account</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <div style="text-align: center;">
                <p style="font-size: 14px; color: #374151; margin-bottom: 5px; font-weight: bold;">Best Regards,</p>
                <p style="font-size: 16px; color: rgb(25, 146, 202); font-weight: bold; margin: 0;">My Store Team</p>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
                    &copy; ${new Date().getFullYear()} My Store. All rights reserved.
                </p>
            </div>
        </div>
    </div>
    `;

  try {
    await sendEmail({
      email: to,
      subject: 'Welcome to My Store - Your Login Credentials',
      html: message,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

/**
 * Send password reset notification email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Employee name
 * @param {string} params.password - New password
 */
const sendPasswordResetEmail = async ({ to, name, password }) => {
  const message = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 1000px; margin: 0 auto; padding: 10px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
        <div style="background-color: #0377bfff; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">My Store</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 25px;">
              Your password has been reset by an administrator. Here is your new temporary password:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: rgb(20, 113, 184); background-color: #eff6ff; padding: 15px 30px; border-radius: 8px; border: 1px dashed rgb(150, 154, 164); display: inline-block;">
                ${password}
              </span>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 30px;">
              <strong>Note:</strong> Please change this password immediately after logging in.
            </p>

            <div style="text-align: center; margin-bottom: 30px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background-color: #0377bfff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Login Now</a>
            </div>

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <div style="text-align: center;">
                <p style="font-size: 14px; color: #374151; margin-bottom: 5px; font-weight: bold;">Best Regards,</p>
                <p style="font-size: 16px; color: rgb(25, 146, 202); font-weight: bold; margin: 0;">My Store Team</p>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
                    &copy; ${new Date().getFullYear()} My Store. All rights reserved.
                </p>
            </div>
        </div>
    </div>
    `;

  try {
    await sendEmail({
      email: to,
      subject: 'Your Password Has Been Reset',
      html: message,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  sendEmployeeWelcomeEmail,
  sendPasswordResetEmail,
};
