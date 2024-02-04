"use client";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useState } from "react";
import Link from "next/link";

import IconBox from "#/client/Shared/icon-box";
import Iconify from "#/utils/iconify";

export default function NavPaperInfoCollapse() {
  const pathname = usePathname();

  const [openInfo, setOpenInfo] = useState(false);

  const faq = pathname === "/my/faq";
  const news = pathname === "/my/news";

  const summary = faq || news;

  return (
    <>
      <ListItemButton
        onClick={() => setOpenInfo((prev) => !prev)}
        sx={{
          color: summary
            ? "primary.light"
            : openInfo
            ? "text.primary"
            : "text.secondary",
          backgroundColor: summary
            ? "rgba(0, 167, 111, 0.08)"
            : openInfo
            ? "rgba(145, 158, 171, 0.08)"
            : "transparent",
          "&:hover": {
            backgroundColor: summary
              ? "rgba(0, 167, 111, 0.16)"
              : "rgba(145, 158, 171, 0.08)",
          },
        }}
      >
        <IconBox iconUrl="/svg/info.svg" iconMarginRight="16px" />
        <ListItemText
          primaryTypographyProps={{
            variant: "body2",
            sx: {
              fontWeight: summary ? 600 : 400,
            },
          }}
        >
          Информация
        </ListItemText>
        {openInfo ? (
          <Iconify icon="solar:alt-arrow-up-bold-duotone" />
        ) : (
          <Iconify icon="solar:alt-arrow-down-bold-duotone" />
        )}
      </ListItemButton>
      <Collapse in={openInfo} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link href="/my/faq">
            <ListItemButton
              onClick={() => !faq && NProgress.start()}
              sx={{
                height: "36px",
                "&:hover": {
                  backgroundColor: faq
                    ? "transparent"
                    : "rgba(145, 158, 171, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  width: "24px",
                  mr: "16px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    transition:
                      "transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    backgroundColor: faq ? "primary.light" : "text.secondary",
                    transform: faq ? "scale(2)" : "none",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  variant: "body2",
                  sx: {
                    fontWeight: faq ? 600 : 400,
                    color: faq ? "text.primary" : "text.secondary",
                  },
                }}
              >
                FAQ
              </ListItemText>
            </ListItemButton>
          </Link>
        </List>
        <List component="div" disablePadding>
          <Link href="/my/news">
            <ListItemButton
              onClick={() => !news && NProgress.start()}
              sx={{
                height: "36px",
                "&:hover": {
                  backgroundColor: news
                    ? "transparent"
                    : "rgba(145, 158, 171, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  width: "24px",
                  mr: "16px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    transition:
                      "transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    transform: news ? "scale(2)" : "none",
                    backgroundColor: news ? "primary.light" : "text.secondary",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  variant: "body2",
                  sx: {
                    fontWeight: news ? 600 : 400,
                    color: news ? "text.primary" : "text.secondary",
                  },
                }}
              >
                Новости
              </ListItemText>
            </ListItemButton>
          </Link>
        </List>
      </Collapse>
    </>
  );
}
