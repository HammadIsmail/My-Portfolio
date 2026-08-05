import Sidebar from "@/components/Sidebar";
import PortfolioContent from "@/components/PortfolioContent";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden">
      <Sidebar />
      <main className="pt-16 md:pt-0 md:fixed md:top-0 md:right-0 md:bottom-0 md:left-64 md:overflow-hidden">
        <PortfolioContent />
        <WhatsAppButton />
      </main>
    </div>
  );
}
