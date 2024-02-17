"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
});

export default function NavigationEvents() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
    ym(96496364, "hit", pathname);
  }, [pathname]);

  return null;
}
