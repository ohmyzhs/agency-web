import { TypingDBProvider } from '@/lib/typing/db/provider';
import { TypingDBSyncInit } from '@/components/typing/organisms/TypingDBSyncInit';

export default function TypingLayout({
  children,
  result,
}: {
  children: React.ReactNode;
  result: React.ReactNode;
}) {
  return (
    <TypingDBProvider>
      <TypingDBSyncInit />
      {children}
      {result}
    </TypingDBProvider>
  );
}
