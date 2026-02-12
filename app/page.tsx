import { AppProvider } from "@/components/app-provider";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-[hsl(210,70%,4%)]">
      <div className="flex min-h-dvh w-full max-w-md flex-col bg-[hsl(210,70%,8%)] shadow-2xl">
        <AppProvider />
      </div>
    </main>
  );
}
