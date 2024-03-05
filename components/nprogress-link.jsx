"use client";

import NProgress from "nprogress";
import Link from "next/link";

export default function NProgressLink({ children, path, ...other }) {
  return (
    <Link href={path} onClick={() => NProgress.start()} {...other}>
      {children}
    </Link>
  );
}
