"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useState } from "react";
import Link from "next/link";

import IconBox from "#/client/Shared/icon-box";
import Iconify from "#/utils/iconify";

export default function DesktopNavInfoPopover() {
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState(null);

  const faq = pathname === "/my/faq";
  const news = pathname === "/my/news";
  const summary = faq || news;

  const open = Boolean(anchorEl);

  return (
    <>
      <ListItemButton
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        sx={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: "16px",
          minHeight: "56px",
          maxWidth: "85px",
          color: summary ? "primary.light" : "text.secondary",
          backgroundColor: summary ? "rgba(0, 167, 111, 0.08)" : "transparent",
          "&:hover": {
            backgroundColor: summary
              ? "rgba(0, 167, 111, 0.16)"
              : "rgba(145, 158, 171, 0.08)",
          },
        }}
      >
        <IconBox iconUrl={"/svg/info.svg"} />
        <ListItemText
          sx={{ mb: "auto" }}
          primaryTypographyProps={{
            variant: "body2",
            sx: { fontWeight: 600, fontSize: "10px" },
          }}
        >
          Информация
        </ListItemText>
        <Iconify
          icon={`solar:alt-arrow-${open ? "left" : "right"}-bold-duotone`}
          sx={{
            width: "16px",
            height: "16px",
            top: "12px",
            right: "8px",
            position: "absolute",
          }}
        />
      </ListItemButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        disableRestoreFocus
        disableScrollLock
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <Stack>
          <Link href="/my/faq" style={{ marginBottom: "4px" }}>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                !faq && NProgress.start();
              }}
              sx={{
                mb: 0,
                transition:
                  "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                fontWeight: faq ? 600 : 400,
                color: faq ? "text.primary" : "text.secondary",
              }}
            >
              FAQ
            </MenuItem>
          </Link>
          <Divider sx={{ mb: "4px" }} />
          <Link href="/my/news">
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                !news && NProgress.start();
              }}
              sx={{
                mb: 0,
                transition:
                  "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                fontWeight: news ? 600 : 400,
                color: news ? "text.primary" : "text.secondary",
              }}
            >
              Новости
            </MenuItem>
          </Link>
        </Stack>
      </Popover>
    </>
  );
}
