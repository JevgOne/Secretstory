import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email with retry logic for high traffic reliability
 */
export async function sendEmail(options: EmailOptions, retries = 3): Promise<boolean> {
  const { to, subject, html, from = 'noreply@lovelygirls.cz' } = options;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await resend.emails.send({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      });

      console.log(`✅ Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      console.error(`❌ Email send attempt ${attempt}/${retries} failed:`, error);

      if (attempt === retries) {
        console.error(`🚨 Email failed after ${retries} attempts to ${to}`);
        return false;
      }

      // Exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
  }

  return false;
}

/**
 * Booking notification - sent to manager AND the specific girl
 */
export async function sendBookingNotification(params: {
  girlEmail: string;
  girlName: string;
  managerEmail: string;
  customerName: string;
  date: string;
  time: string;
  bookingId: number;
}) {
  const { girlEmail, girlName, managerEmail, customerName, date, time, bookingId } = params;

  // Email for the girl
  const girlHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B1538;">Nová rezervace pro tebe! 🎉</h2>
      <p>Ahoj ${girlName},</p>
      <p>Máš novou rezervaci:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Zákazník:</strong> ${customerName}</p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Čas:</strong> ${time}</p>
        <p><strong>ID:</strong> #${bookingId}</p>
      </div>
      <p>Zkontroluj prosím detaily v administraci.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/girl/dashboard"
         style="display: inline-block; background: #8B1538; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
        Zobrazit rezervace
      </a>
    </div>
  `;

  // Email for the manager
  const managerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B1538;">Nová rezervace - ${girlName}</h2>
      <p>Nová rezervace byla vytvořena:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Dívka:</strong> ${girlName}</p>
        <p><strong>Zákazník:</strong> ${customerName}</p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Čas:</strong> ${time}</p>
        <p><strong>ID:</strong> #${bookingId}</p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/manager/dashboard"
         style="display: inline-block; background: #8B1538; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
        Zobrazit v systému
      </a>
    </div>
  `;

  // Send both emails in parallel for performance
  const [girlResult, managerResult] = await Promise.all([
    sendEmail({
      to: girlEmail,
      subject: `🎉 Nová rezervace pro ${date}`,
      html: girlHtml
    }),
    sendEmail({
      to: managerEmail,
      subject: `Nová rezervace - ${girlName} (${date})`,
      html: managerHtml
    })
  ]);

  return girlResult && managerResult;
}

// Review notifications are now handled directly in /api/reviews/route.ts
// to avoid sending emails to girls (only admins should receive them)

/**
 * New girl registration notification - sent to all admins
 */
export async function sendNewGirlNotification(params: {
  adminEmails: string[];
  girlName: string;
  girlEmail: string;
  girlId: number;
}) {
  const { adminEmails, girlName, girlEmail, girlId } = params;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8B1538;">Nová dívka se zaregistrovala! 🎊</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Jméno:</strong> ${girlName}</p>
        <p><strong>Email:</strong> ${girlEmail}</p>
        <p><strong>ID:</strong> #${girlId}</p>
      </div>
      <p>Je potřeba ověřit profil a schválit účet.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/girls/${girlId}/edit"
         style="display: inline-block; background: #8B1538; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
        Zobrazit profil
      </a>
    </div>
  `;

  // Send to all admins
  const results = await Promise.all(
    adminEmails.map(adminEmail =>
      sendEmail({
        to: adminEmail,
        subject: `🎊 Nová registrace - ${girlName}`,
        html
      })
    )
  );

  return results.every(result => result === true);
}
