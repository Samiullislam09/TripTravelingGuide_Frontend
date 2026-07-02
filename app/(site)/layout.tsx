import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ScrollProgressBar from "@/components/layout/ScrollProgressBar";
import BackToTop from "@/components/layout/BackToTop";
import { MotionRoot } from "@/components/motion/MotionRoot";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MotionRoot />
      <ScrollProgressBar />
      <Header />
      {/* pb-24 leaves room for the mobile bottom nav (hidden on lg+). */}
      <main className="min-h-screen pb-24 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <BackToTop />
    </>
  );
}
