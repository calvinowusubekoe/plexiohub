import { AdminNav } from '@/components/admin/AdminNav';
import { countNewQuotes } from '@/lib/data/quotes';
import { requireAdmin, signOut } from './actions';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const newCount = await countNewQuotes().catch(() => 0);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <AdminNav newCount={newCount} email={user.email ?? ''} signOutAction={signOut} />
      <main className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
