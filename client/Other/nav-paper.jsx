"use client";

import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import SimpleBar from "simplebar-react";
import NProgress from "nprogress";
import Image from "next/image";
import Link from "next/link";

import NavigationLinks from "#/client/Other/navigation-links";
import AccountLink from "#/client/Other/account-link";
import AppLogo from "#/client/Shared/app-logo";

import illustration_docs from "#/public/svg/illustration_docs.svg";
import "simplebar-react/dist/simplebar.min.css";

export default function NavPaper({ username, keys }) {
  return (
    <SimpleBar style={{ height: "100%" }}>
      <Box
        sx={{
          mt: "24px",
          ml: "24px",
        }}
      >
        <AppLogo />
      </Box>
      <AccountLink username={username} keys={keys} />
      <List
        disablePadding
        sx={{
          p: "0 16px",
        }}
      >
        <ListSubheader
          disableSticky
          sx={{
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: "11px",
            p: "24px 16px 8px",
          }}
        >
          НАВИГАЦИЯ
        </ListSubheader>
        <NavigationLinks />
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Stack
        sx={{
          gap: "24px",
          p: "0 40px 40px 40px",
          mt: "80px",
          width: "100%",
          display: "block",
          textAlign: "center",
        }}
      >
        <Image src={illustration_docs} priority={true} />
        <Box sx={{ mt: 5 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "text.primary" }}
          >
            Привет, {username}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Нужна помощь?
            <br />
            посмотри наш FAQ
          </Typography>
          <Link href="/my/faq">
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={() => {
                NProgress.start();
                NProgress.done();
              }}
              sx={{
                backgroundColor: "rgb(81, 25, 183)",
                boxShadow: "rgba(142, 51, 255, 0.24) 0px 8px 16px 0px",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              FAQ
            </Button>
          </Link>
        </Box>
      </Stack>
    </SimpleBar>
  );
}
