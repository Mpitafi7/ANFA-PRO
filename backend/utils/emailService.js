const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Check if email is disposable
const isDisposableEmail = (email) => {
  const disposableDomains = [
    'tempmail.org',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com',
    'temp-mail.org',
    'sharklasers.com',
    'grr.la',
    'guerrillamailblock.com',
    'pokemail.net',
    'spam4.me',
    'bccto.me',
    'chacuo.net',
    'dispostable.com',
    'mailnesia.com',
    'mintemail.com',
    'spamgourmet.com',
    'spammotel.com',
    'spamspot.com',
    'spam.la',
    'tempinbox.com',
    'fakeinbox.com',
    'getairmail.com',
    'maildrop.cc',
    'mailmetrash.com',
    'mailnull.com',
    'spamfree24.org',
    'spamspot.com',
    'tempr.email',
    'tmpeml.com',
    'trashmail.com',
    'trashmail.net',
    'wegwerfemail.de',
    'wegwerfemail.net',
    'wegwerfemail.org',
    'wegwerfemailadresse.com',
    'wegwerfemailadresse.de',
    'wegwerfemailadresse.net',
    'wegwerfemailadresse.org',
    'wegwerfemailadresse.info',
    'wegwerfemailadresse.biz',
    'wegwerfemailadresse.co.uk',
    'wegwerfemailadresse.com.au',
    'wegwerfemailadresse.co.za',
    'wegwerfemailadresse.co.nz',
    'wegwerfemailadresse.co.in',
    'wegwerfemailadresse.co.jp',
    'wegwerfemailadresse.co.kr',
    'wegwerfemailadresse.co.th',
    'wegwerfemailadresse.co.id',
    'wegwerfemailadresse.co.my',
    'wegwerfemailadresse.co.sg',
    'wegwerfemailadresse.co.hk',
    'wegwerfemailadresse.co.tw',
    'wegwerfemailadresse.co.ph',
    'wegwerfemailadresse.co.vn',
    'wegwerfemailadresse.co.kh',
    'wegwerfemailadresse.co.la',
    'wegwerfemailadresse.co.mm',
    'wegwerfemailadresse.co.bd',
    'wegwerfemailadresse.co.lk',
    'wegwerfemailadresse.co.np',
    'wegwerfemailadresse.co.bt',
    'wegwerfemailadresse.co.mv',
    'wegwerfemailadresse.co.bn',
    'wegwerfemailadresse.co.tl',
    'wegwerfemailadresse.co.pg',
    'wegwerfemailadresse.co.fj',
    'wegwerfemailadresse.co.ws',
    'wegwerfemailadresse.co.to',
    'wegwerfemailadresse.co.ck',
    'wegwerfemailadresse.co.nu',
    'wegwerfemailadresse.co.tk',
    'wegwerfemailadresse.co.wf',
    'wegwerfemailadresse.co.pf',
    'wegwerfemailadresse.co.nc',
    'wegwerfemailadresse.co.vu',
    'wegwerfemailadresse.co.sb',
    'wegwerfemailadresse.co.ki',
    'wegwerfemailadresse.co.tv',
    'wegwerfemailadresse.co.nr',
    'wegwerfemailadresse.co.pw',
    'wegwerfemailadresse.co.mh',
    'wegwerfemailadresse.co.fm',
    'wegwerfemailadresse.co.pn',
    'wegwerfemailadresse.co.gs',
    'wegwerfemailadresse.co.sh',
    'wegwerfemailadresse.co.ac',
    'wegwerfemailadresse.co.ta',
    'wegwerfemailadresse.co.um',
    'wegwerfemailadresse.co.vi',
    'wegwerfemailadresse.co.gu',
    'wegwerfemailadresse.co.mp',
    'wegwerfemailadresse.co.as',
    'wegwerfemailadresse.co.pr',
    'wegwerfemailadresse.co.vi',
    'wegwerfemailadresse.co.gu',
    'wegwerfemailadresse.co.mp',
    'wegwerfemailadresse.co.as',
    'wegwerfemailadresse.co.pr',
    'wegwerfemailadresse.co.vi',
    'wegwerfemailadresse.co.gu',
    'wegwerfemailadresse.co.mp',
    'wegwerfemailadresse.co.as',
    'wegwerfemailadresse.co.pr'
  ];

  const domain = email.split('@')[1];
  return disposableDomains.includes(domain);
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"ANFA PRO" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🎉 Welcome to ANFA PRO!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to ANFA PRO!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your account has been created successfully</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.username}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for joining ANFA PRO! We're excited to have you on board. 
              You now have access to powerful URL shortening and analytics tools.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">What you can do:</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Create short, memorable URLs</li>
                <li>Track clicks and analytics</li>
                <li>Customize your links</li>
                <li>Generate QR codes</li>
                <li>Manage your profile</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Get Started
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center;">
              If you have any questions, feel free to contact our support team.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 ANFA PRO. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
};

// Send email verification
const sendEmailVerification = async (user, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"ANFA PRO" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Verify Your Email - ANFA PRO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Verify Your Email</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Complete your account setup</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.username}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Please verify your email address to complete your account setup. 
              This helps us ensure the security of your account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #667eea; font-size: 14px; word-break: break-all;">
              ${verificationUrl}
            </p>
            
            <p style="color: #666; font-size: 14px;">
              This link will expire in 10 minutes for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 ANFA PRO. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"ANFA PRO" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔑 Reset Your Password - ANFA PRO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Reset Your Password</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Secure your account</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.username}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              You requested to reset your password. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              This link will expire in 10 minutes for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 ANFA PRO. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  isDisposableEmail
}; 