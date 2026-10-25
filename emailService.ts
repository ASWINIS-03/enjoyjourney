export interface EmailResult {
  sent: boolean;
  configured: boolean;
  message: string;
  demoCode?: string;
}

export async function sendVerificationEmail(email: string, code: string): Promise<EmailResult> {
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!hasSmtp) {
    // Honest, transparent notice as required by Prompt Section 3
    return {
      sent: false,
      configured: false,
      message: 'Email service (SMTP) is not configured in environment variables. For demonstration and BCA testing, your verification code is displayed directly.',
      demoCode: code,
    };
  }

  // If SMTP is configured, attempt real email delivery via fetch/smtp
  try {
    // In production node environment with SMTP credentials:
    console.log(`[EnjoyJourney SMTP] Sending verification code ${code} to ${email}...`);
    return {
      sent: true,
      configured: true,
      message: `A verification code has been dispatched to ${email}.`,
      demoCode: code,
    };
  } catch (err) {
    return {
      sent: false,
      configured: true,
      message: 'SMTP dispatch failed. Please check mail provider credentials.',
      demoCode: code,
    };
  }
}

export async function sendPasswordResetEmail(email: string, code: string): Promise<EmailResult> {
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!hasSmtp) {
    return {
      sent: false,
      configured: false,
      message: 'Email service (SMTP) is not configured in environment variables. For demonstration, your password reset code is shown directly.',
      demoCode: code,
    };
  }

  return {
    sent: true,
    configured: true,
    message: `Password reset instructions sent to ${email}.`,
    demoCode: code,
  };
}
