"use client";

import ListItemButton from "@mui/material/ListItemButton";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import Link from "next/link";

import { useMode } from "#/client/Global/theme-registry";

export default function RootPrimaryHeaderLinks({ scrolled }) {
  const pathname = usePathname();
  const { mode } = useMode();

  const root = pathname === "/";
  const faq = pathname === "/faq";

  return scrolled ? (
    <>
      <Link href="/">
        <ListItemButton
          disableRipple
          onClick={() => !root && NProgress.start()}
          sx={{
            p: "0px",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "text.primary",
            height: "100%",
            "&::after": {
              display: "block",
              position: "absolute",
              height: "4px",
              left: "0px",
              right: "0px",
              bottom: "0px",
              borderRadius: "3px 3px 0px 0px",
              content: '""',
              backgroundColor: root ? "primary.main" : "transparent",
            },
            "&:hover": {
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              backgroundColor: "transparent",
              "&::after": {
                display: "block",
                position: "absolute",
                height: "4px",
                left: "0px",
                right: "0px",
                bottom: "0px",
                borderRadius: "3px 3px 0px 0px",
                content: '""',
                backgroundColor: root
                  ? "rgba(0, 167, 111, 0.7)"
                  : mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          Главная
        </ListItemButton>
      </Link>
      <Link href="/faq">
        <ListItemButton
          disableRipple
          onClick={() => !faq && NProgress.start()}
          sx={{
            p: "0px",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "text.primary",
            height: "100%",
            "&::after": {
              display: "block",
              position: "absolute",
              height: "4px",
              left: "0px",
              right: "0px",
              bottom: "0px",
              borderRadius: "3px 3px 0px 0px",
              content: '""',
              backgroundColor: faq ? "primary.main" : "transparent",
            },
            "&:hover": {
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              backgroundColor: "transparent",
              "&::before": {
                display: "block",
                position: "absolute",
                height: "4px",
                left: "0px",
                right: "0px",
                bottom: "0px",
                borderRadius: "3px 3px 0px 0px",
                content: '""',
                backgroundColor: faq
                  ? "rgba(0, 167, 111, 0.7)"
                  : mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          FAQ
        </ListItemButton>
      </Link>
    </>
  ) : (
    <>
      <Link href="/">
        <ListItemButton
          disableRipple
          onClick={() => !root && NProgress.start()}
          sx={{
            p: "0px",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: root ? "primary.main" : "text.primary",
            height: "100%",
            "&::before": {
              content: '""',
              borderRadius: "50%",
              position: "absolute",
              width: "6px",
              height: "6px",
              left: "-14px",
              opacity: 0.48,
              backgroundColor: root ? "primary.main" : "transparent",
            },
            "&:hover": {
              color: root
                ? "rgba(0, 167, 111, 0.7)"
                : mode === "dark"
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(33, 43, 54, 0.7)",
              backgroundColor: "transparent",
              "&::before": {
                content: '""',
                borderRadius: "50%",
                position: "absolute",
                width: "6px",
                height: "6px",
                left: "-14px",
                opacity: 0.48,
                backgroundColor: root
                  ? "rgba(0, 167, 111, 0.7)"
                  : mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          Главная
        </ListItemButton>
      </Link>
      <Link href="/faq">
        <ListItemButton
          disableRipple
          onClick={() => !faq && NProgress.start()}
          sx={{
            p: "0px",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: faq ? "primary.main" : "text.primary",
            height: "100%",
            "&::before": {
              content: '""',
              borderRadius: "50%",
              position: "absolute",
              width: "6px",
              height: "6px",
              left: "-14px",
              opacity: 0.48,
              backgroundColor: faq ? "primary.main" : "transparent",
            },
            "&:hover": {
              color: faq
                ? "rgba(0, 167, 111, 0.7)"
                : mode === "dark"
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(33, 43, 54, 0.7)",
              backgroundColor: "transparent",
              "&::before": {
                content: '""',
                borderRadius: "50%",
                position: "absolute",
                width: "6px",
                height: "6px",
                left: "-14px",
                opacity: 0.48,
                backgroundColor: faq
                  ? "rgba(0, 167, 111, 0.7)"
                  : mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(33, 43, 54, 0.7)",
              },
            },
          }}
        >
          FAQ
        </ListItemButton>
      </Link>
    </>
  );
}
