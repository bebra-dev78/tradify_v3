"use client";

import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import NProgress from "nprogress";
import Link from "next/link";

import Iconify from "#/utils/iconify";

export default function PopoverMenu({ username, email, setAnchorEl }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Box sx={{ p: "8px" }}>
        <Link href="/my/account">
          <MenuItem
            onClick={() => {
              pathname !== "/my/account" && NProgress.start();
              setAnchorEl(null);
            }}
            sx={{ justifyContent: "space-between" }}
          >
            <Stack sx={{ width: "150px" }}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{ color: "text.primary" }}
              >
                {username}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                sx={{ color: "text.secondary" }}
              >
                {email}
              </Typography>
            </Stack>
            <ListItemIcon sx={{ minWidth: "0px !important" }}>
              <Iconify
                icon="solar:alt-arrow-right-bold-duotone"
                width={20}
                sx={{ color: "text.secondary" }}
              />
            </ListItemIcon>
          </MenuItem>
        </Link>
      </Box>
      <Divider />
      <Stack sx={{ p: "8px" }}>
        <Link href="/my/overview">
          <MenuItem
            onClick={() => {
              pathname !== "/my/overview" && NProgress.start();
              setAnchorEl(null);
            }}
            sx={{
              color: "text.primary",
              justifyContent: "space-between",
            }}
          >
            Главная
            <ListItemIcon sx={{ minWidth: "0px !important" }}>
              <Iconify
                icon="solar:alt-arrow-right-bold-duotone"
                width={20}
                sx={{ color: "text.secondary" }}
              />
            </ListItemIcon>
          </MenuItem>
        </Link>
        <Link href="/my/trades">
          <MenuItem
            onClick={() => {
              pathname !== "/my/trades" && NProgress.start();
              setAnchorEl();
            }}
            sx={{
              color: "text.primary",
              justifyContent: "space-between",
            }}
          >
            Сделки
            <ListItemIcon sx={{ minWidth: "0px !important" }}>
              <Iconify
                icon="solar:alt-arrow-right-bold-duotone"
                width={20}
                sx={{ color: "text.secondary" }}
              />
            </ListItemIcon>
          </MenuItem>
        </Link>
        <Link href="/my/analytics">
          <MenuItem
            onClick={() => {
              pathname !== "/my/analytics" && NProgress.start();
              setAnchorEl(null);
            }}
            sx={{
              color: "text.primary",
              justifyContent: "space-between",
            }}
          >
            Аналитика
            <ListItemIcon sx={{ minWidth: "0px !important" }}>
              <Iconify
                icon="solar:alt-arrow-right-bold-duotone"
                width={20}
                sx={{ color: "text.secondary" }}
              />
            </ListItemIcon>
          </MenuItem>
        </Link>
      </Stack>
      <Divider />
      <MenuItem
        sx={{ m: "8px", color: "error.main", fontWeight: 700 }}
        onClick={() => {
          router.prefetch("/login");
          signOut({ redirect: false }).then(() => {
            setAnchorEl(null);
            NProgress.start();
            router.push("/login");
          });
        }}
      >
        <ListItemIcon sx={{ minWidth: "28px !important" }}>
          <Iconify
            icon="line-md:logout"
            width={20}
            sx={{ color: "error.main", transform: "scaleX(-1)" }}
          />
        </ListItemIcon>
        Выйти
      </MenuItem>
    </>
  );
}
