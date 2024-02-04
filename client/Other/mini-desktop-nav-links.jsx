"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import Link from "next/link";

import DesktopNavInfoPopover from "#/client/Other/desktop-nav-info-popover";
import IconBox from "#/client/Shared/icon-box";

const navLinks = [
  { path: "/my/overview", label: "Главная", iconUrl: "/svg/overview.svg" },
  { path: "/my/trades", label: "Сделки", iconUrl: "/svg/trades.svg" },
  { path: "/my/analytics", label: "Аналитика", iconUrl: "/svg/analytics.svg" },
];

export default function MiniDesktopNavLinks() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <>
      {navLinks.map(({ path, label, iconUrl }) => (
        <Link key={path} href={path}>
          <ListItemButton
            onClick={() => !isActive(path) && NProgress.start()}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              lineHeight: "16px",
              minHeight: "56px",
              maxWidth: "85px",
              pr: "24px",
              pl: "24px",
              color: isActive(path) ? "primary.light" : "text.secondary",
              backgroundColor: isActive(path)
                ? "rgba(0, 167, 111, 0.08)"
                : "transparent",
              "&:hover": {
                backgroundColor: isActive(path)
                  ? "rgba(0, 167, 111, 0.16)"
                  : "rgba(145, 158, 171, 0.08)",
              },
            }}
          >
            <IconBox iconUrl={iconUrl} />
            <ListItemText
              sx={{ mb: "auto" }}
              primaryTypographyProps={{
                variant: "body2",
                sx: {
                  fontWeight: isActive(path) ? 600 : 400,
                  fontSize: "10px",
                },
              }}
            >
              {label}
            </ListItemText>
          </ListItemButton>
        </Link>
      ))}
      <ListItemButton
        disabled
        onClick={() => pathname !== "/my/journal" && NProgress.start()}
        sx={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: "16px",
          minHeight: "56px",
          maxWidth: "85px",
          pr: "24px",
          pl: "24px",
          color: "text.disabled",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(145, 158, 171, 0.08)",
          },
        }}
      >
        <IconBox iconUrl={"/svg/journal.svg"} />
        <ListItemText
          sx={{ mb: "auto" }}
          primaryTypographyProps={{
            variant: "body2",
            sx: { fontWeight: 600, fontSize: "10px" },
          }}
        >
          Журнал
        </ListItemText>
      </ListItemButton>
      <DesktopNavInfoPopover />
      <Link href="https://t.me/tradifyy" prefetch={false} target="_blank">
        <ListItemButton
          sx={{
            color: "text.secondary",
            backgroundColor: "transparent",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            lineHeight: "16px",
            minHeight: "56px",
            maxWidth: "85px",
            pr: "24px",
            pl: "24px",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <IconBox iconUrl={"/svg/external.svg"} />
          <ListItemText
            sx={{ mb: "auto" }}
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: 600, fontSize: "10px" },
            }}
          >
            Telegram
          </ListItemText>
        </ListItemButton>
      </Link>
    </>
  );
}
