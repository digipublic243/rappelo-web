import { AppShell } from "@/components/layout/AppShell";

interface TenantPageFrameProps {
  currentPath: string;
  children: React.ReactNode;
}

export function TenantPageFrame({ currentPath, children }: TenantPageFrameProps) {
  return (
    <AppShell role="tenant" currentPath={currentPath}>
      {children}
    </AppShell>
  );
}
