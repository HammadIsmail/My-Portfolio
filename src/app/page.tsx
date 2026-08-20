import Sidebar from "@/components/Sidebar";
import PortfolioContent from "@/components/PortfolioContent";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-purple-500 selection:text-white">
      <Sidebar />
      <main className="pt-20 md:pt-24 pb-12 w-full">
        <PortfolioContent />
        <WhatsAppButton />
      </main>
    </div>
  );
}
