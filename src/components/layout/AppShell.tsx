import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { preloadTabPages } from "@/routes/lazyPages";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";

const PRELOAD_DELAY_MS = 1200;

export function AppShell() {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(preloadTabPages, PRELOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="[--side-nav-width:16rem] xl:[--side-nav-width:18rem]">
      <SideNav />
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="lg:pl-(--side-nav-width)"
      >
        <Suspense fallback={<MascotLoader />}>
          <Outlet />
        </Suspense>
      </motion.div>
      <BottomNav />
    </div>
  );
}
