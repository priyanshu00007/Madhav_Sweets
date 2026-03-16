import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials missing. Pre-empting transmission...");
    return { success: false, error: "Credentials missing" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Ambrosia Supreme" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Transmission Successful:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Transmission Failed:", error);
    return { success: false, error };
  }
};

export const getOrderConfirmationTemplate = (orderId: string, total: number) => `
<div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 8px solid #ffcc15;">
  <h1 style="text-transform: uppercase; letter-spacing: 5px; border-bottom: 2px solid #ffcc15; padding-bottom: 10px;">Transmission Confirmed</h1>
  <p style="font-size: 10px; text-transform: uppercase; opacity: 0.6; margin-bottom: 20px;">Protocol ID: #${orderId}</p>
  <p style="font-size: 18px;">Your request for luxury heritage sweets has been ingested into our system.</p>
  <div style="background-color: #ffcc15; color: #000; padding: 20px; margin: 30px 0; font-weight: bold; text-align: center;">
    TOTAL VALUATION: ₹${total}
  </div>
  <p style="font-size: 12px; opacity: 0.8;">Our Bullet Riders are being briefed. Monitor your tracking nexus for real-time updates.</p>
  <div style="margin-top: 40px; border-top: 1px solid #333; pt: 20px; font-size: 10px; color: #666;">
    AMBROSIA SUPREME | EST. 2026
  </div>
</div>
`;

export const getOTPTemplate = (otp: string) => `
<div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 8px solid #ffcc15; text-align: center;">
  <h1 style="text-transform: uppercase; letter-spacing: 5px; color: #ffcc15;">Security Token</h1>
  <p style="font-size: 12px; opacity: 0.8; margin-bottom: 30px;">Share this credential with your Bullet Rider upon arrival.</p>
  <div style="font-size: 64px; font-weight: 900; letter-spacing: 15px; color: #fff; margin: 40px 0; font-family: monospace;">
    ${otp}
  </div>
  <p style="font-size: 10px; text-transform: uppercase; opacity: 0.4;">Authenticating Session...</p>
</div>
`;

export const getResetPasswordTemplate = (resetUrl: string) => `
<div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 8px solid #ffcc15;">
  <h1 style="text-transform: uppercase; letter-spacing: 5px; border-bottom: 2px solid #ffcc15; padding-bottom: 10px;">Aegis Reset Protocol</h1>
  <p style="font-size: 10px; text-transform: uppercase; opacity: 0.6; margin-bottom: 20px;">Security Verification Requested</p>
  <p style="font-size: 18px;">A tactical request for password recalibration has been initiated for your account.</p>
  <div style="margin: 40px 0; text-align: center;">
    <a href="${resetUrl}" style="background-color: #ffcc15; color: #000; padding: 20px 40px; text-decoration: none; font-weight: 900; text-transform: uppercase; display: inline-block;">Recalibrate Now</a>
  </div>
  <p style="font-size: 12px; opacity: 0.8;">If you did not authorize this maneuver, ignore this transmission. This link self-destructs in 1 hour.</p>
  <div style="margin-top: 40px; border-top: 1px solid #333; pt: 20px; font-size: 10px; color: #666;">
    AMBROSIA SUPREME | EST. 2026
  </div>
</div>
`;

export const getNewsletterWelcomeTemplate = (name: string) => `
<div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 8px solid #ffcc15;">
  <h1 style="text-transform: uppercase; letter-spacing: 5px; color: #ffcc15;">Inner Circle Access</h1>
  <p style="font-size: 18px; margin-bottom: 30px;">Welcome to the Elite, ${name}.</p>
  <p style="font-size: 14px; line-height: 1.6;">You have successfully enlisted in the Ambrosia Supreme Inner Circle. Prepare for high-fidelity updates on heritage collections, tactical discounts, and elite event intel.</p>
  <div style="background-color: #1a1a1a; padding: 20px; margin: 30px 0; border-left: 4px solid #ffcc15; font-style: italic;">
    "Luxury is not a choice, it's a protocol."
  </div>
  <p style="font-size: 10px; opacity: 0.6;">You are receiving this because your terminal was registered for tactical updates.</p>
</div>
`;

export const getWelcomeTemplate = (name: string) => `
<div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 8px solid #ffcc15;">
  <h1 style="text-transform: uppercase; letter-spacing: 5px; color: #ffcc15;">Protocol Enlisted</h1>
  <p style="font-size: 18px; margin-bottom: 30px;">Salutations, ${name}.</p>
  <p style="font-size: 14px; line-height: 1.6;">Your credentials have been verified and integrated into the Ambrosia Supreme mainframe. You now have full-spectrum access to the most elite heritage collections in the subcontinent.</p>
  <div style="background-color: #ffcc15; color: #000; padding: 20px; margin: 30px 0; font-weight: 900; text-align: center; text-transform: uppercase;">
    Access Level: AUTHENTICATED
  </div>
  <p style="font-size: 12px; opacity: 0.8;">Use your registered terminal to browse the gallery and initiate acquisition protocols.</p>
  <div style="margin-top: 40px; border-top: 1px solid #333; pt: 20px; font-size: 10px; color: #666;">
    AMBROSIA SUPREME | EST. 2026
  </div>
</div>
`;
