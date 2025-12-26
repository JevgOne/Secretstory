import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// Force dynamic rendering for all admin pages (no static pre-rendering)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages({ locale: 'cs' });

  return (
    <NextIntlClientProvider locale="cs" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
