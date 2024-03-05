"use client";

import NProgress from "nprogress";
import Image from "next/image";
import Link from "next/link";

import logo from "#/public/svg/logo.svg";

export default function AppLogo() {
  return (
    <Link
      href="/"
      onClick={() => {
        NProgress.start();
        NProgress.done();
      }}
    >
      <Image src={logo} />
    </Link>
  );
}
