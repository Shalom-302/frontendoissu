import { AppShell } from '@/components/layout/app-shell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell space="admin">{children}</AppShell>
}
