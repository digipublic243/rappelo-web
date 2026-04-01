import { AppShell } from "@/components/layout/AppShell";

interface LandlordPageFrameProps {
  currentPath: string;
  children: React.ReactNode;
}

export function LandlordPageFrame({ currentPath, children }: LandlordPageFrameProps) {
  return (
    <AppShell role="landlord" currentPath={currentPath}>
      {children}
    </AppShell>
  );
}
