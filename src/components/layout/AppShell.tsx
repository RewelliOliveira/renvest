import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { MascotLoader } from "@/components/ui/MascotLoader";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  return (
    <div className="[--side-nav-width:16rem] xl:[--side-nav-width:18rem]">
      <SideNav />
      <div className="lg:pl-(--side-nav-width)">
        <Suspense fallback={<MascotLoader />}>
          <Outlet />
        </Suspense>
      </div>
      <BottomNav />
    </div>
  );
}
