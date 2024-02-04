"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import AppLogo from "#/client/Shared/app-logo";
import Iconify from "#/utils/iconify";

import menu from "#/public/svg/menu.svg";

export default function RootPrimaryHeaderMobileMenu() {
  const pathname = usePathname();

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => {
          setOpenDrawer(true);
        }}
        sx={{ ml: "8px" }}
      >
        <Image src={menu} alt="Меню" />
      </IconButton>
      <Drawer
        open={openDrawer}
        anchor="left"
        onClose={() => {
          setOpenDrawer(false);
        }}
        PaperProps={{
          sx: {
            width: "280px",
            padding: 0,
            borderRadius: 0,
            border: "none",
          },
        }}
      >
        <Stack
          sx={{
            gap: "24px",
            flexShrink: 0,
            p: "24px 20px 16px",
          }}
        >
          <AppLogo />
        </Stack>
        <Stack>
          <List disablePadding sx={{ p: "8px" }}>
            <Link href="/">
              <ListItemButton
                onClick={() => pathname !== "/" && NProgress.start()}
                sx={{
                  color: pathname === "/" ? "primary.light" : "text.secondary",
                  backgroundColor:
                    pathname === "/"
                      ? "rgba(0, 167, 111, 0.08)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor:
                      pathname === "/"
                        ? "rgba(0, 167, 111, 0.16)"
                        : "rgba(145, 158, 171, 0.08)",
                  },
                }}
              >
                <Iconify icon="solar:home-2-bold-duotone" sx={{ mr: "16px" }} />
                <ListItemText
                  primaryTypographyProps={{
                    variant: "body2",
                    sx: { fontWeight: pathname === "/" ? 600 : 400 },
                  }}
                >
                  Главная
                </ListItemText>
              </ListItemButton>
            </Link>
            <Link href="/faq">
              <ListItemButton
                onClick={() => pathname !== "/faq" && NProgress.start()}
                sx={{
                  color:
                    pathname === "/faq" ? "primary.light" : "text.secondary",
                  backgroundColor:
                    pathname === "/faq"
                      ? "rgba(0, 167, 111, 0.08)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor:
                      pathname === "/faq"
                        ? "rgba(0, 167, 111, 0.16)"
                        : "rgba(145, 158, 171, 0.08)",
                  },
                }}
              >
                <Iconify
                  icon="solar:notebook-bold-duotone"
                  sx={{ mr: "16px" }}
                />
                <ListItemText
                  primaryTypographyProps={{
                    variant: "body2",
                    sx: { fontWeight: pathname === "/faq" ? 600 : 400 },
                  }}
                >
                  FAQ
                </ListItemText>
              </ListItemButton>
            </Link>
          </List>
        </Stack>
      </Drawer>
    </>
  );
}
