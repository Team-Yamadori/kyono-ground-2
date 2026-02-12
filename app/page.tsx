import { AppProvider } from "@/components/app-provider";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col bg-[hsl(210,70%,8%)]">
      <AppProvider />
    </main>
  );
}
