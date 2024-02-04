"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import Link from "next/link";

import NavPaperInfoCollapse from "#/client/Other/nav-paper-info-collapse";
import IconBox from "#/client/Shared/icon-box";

const navLinks = [
  { path: "/my/overview", label: "Главная", iconUrl: "/svg/overview.svg" },
  { path: "/my/trades", label: "Сделки", iconUrl: "/svg/trades.svg" },
  { path: "/my/analytics", label: "Аналитика", iconUrl: "/svg/analytics.svg" },
];

export default function NavigationLinks() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <>
      {navLinks.map(({ path, label, iconUrl }) => (
        <Link key={path} href={path}>
          <ListItemButton
            onClick={() => !isActive(path) && NProgress.start()}
            sx={{
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
            <IconBox iconUrl={iconUrl} iconMarginRight="16px" />
            <ListItemText
              primaryTypographyProps={{
                variant: "body2",
                sx: { fontWeight: isActive(path) ? 600 : 400 },
              }}
            >
              {label}
            </ListItemText>
          </ListItemButton>
        </Link>
      ))}
      <Tooltip title="В разработке (возможно)" arrow>
        <ListItemButton
          sx={{
            color: "text.disabled",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <IconBox iconUrl="/svg/journal.svg" iconMarginRight="16px" />
          <ListItemText
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: 400 },
            }}
          >
            Журнал
          </ListItemText>
        </ListItemButton>
      </Tooltip>
      <NavPaperInfoCollapse />
      <Link href="https://t.me/tradifyy" prefetch={false} target="_blank">
        <ListItemButton
          sx={{
            color: "text.secondary",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(145, 158, 171, 0.08)",
            },
          }}
        >
          <IconBox iconUrl="/svg/external.svg" iconMarginRight="16px" />
          <ListItemText
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: 400 },
            }}
          >
            Канал Telegram
          </ListItemText>
        </ListItemButton>
      </Link>
    </>
  );
}
