import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ScrollProgressBar from "@/components/layout/ScrollProgressBar";
import BackToTop from "@/components/layout/BackToTop";
import { MotionRoot } from "@/components/motion/MotionRoot";

// MobileBottomNav is temporarily disabled — hidden site-wide until UI/mobile
// pass is complete. Re-add `<MobileBottomNav />` (and restore the main pb-24
// bottom padding) to bring it back.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MotionRoot />
      <ScrollProgressBar />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
