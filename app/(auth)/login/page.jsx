import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import Image from "next/image";

import AuthOverlay from "#/client/Shared/auth-overlay";
import { LinkToRegister } from "#/client/Login/links";
import AppLogo from "#/client/Shared/app-logo";
import Form from "#/client/Login/form";

import auth_illustration from "#/public/images/auth_illustration.png";

export const metadata = {
  title: "Вход | Tradify",
  description: "Tradify —	вход в аккаунт",
};

export default function Login() {
  return (
    <Box
      component="main"
      sx={{
        height: "100%",
        display: "flex",
        position: "relative",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          zIndex: 1,
          width: "40px",
          height: "40px",
          position: "absolute",
          "@media (min-width: 0px)": {
            mt: "12px",
            ml: "16px",
          },
          "@media (min-width: 900px)": {
            mt: "40px",
            ml: "40px",
          },
        }}
      >
        <AppLogo />
      </Box>
      <Box
        sx={{
          display: "none",
          position: "relative",
          "@media (min-width: 900px)": {
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            zIndex: 1,
            m: "0px 0px 80px",
            maxWidth: "480px",
            textAlign: "center",
          }}
        >
          Привет, с возвращением
        </Typography>
        <Box
          component="span"
          sx={{
            zIndex: 1,
            lineHeight: 1,
            display: "block",
            maxWidth: "720px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image src={auth_illustration} priority={true} alt="Вход в аккаунт" />
        </Box>
        <AuthOverlay />
      </Box>
      <Box
        sx={{
          m: "auto",
          width: "480px",
          display: "flex",
          p: "120px 16px",
          minHeight: "100vh",
          justifyContent: "center",
          "@media (min-width: 900px)": {
            flexShrink: 0,
            p: "144px 64px 0px",
          },
        }}
      >
        <Stack sx={{ width: "100%" }}>
          <Stack sx={{ gap: "8px", mb: "40px", position: "relative" }}>
            <Typography variant="h4">Вход в аккаунт</Typography>
            <Stack
              sx={{ flexDirection: "row", gap: "4px", alignItems: "center" }}
            >
              <Typography variant="body2">Новый пользователь?</Typography>
              <LinkToRegister />
            </Stack>
          </Stack>
          <Form />
        </Stack>
      </Box>
    </Box>
  );
}
