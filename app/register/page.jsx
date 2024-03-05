import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import Image from "next/image";

import AuthOverlay from "#/components/other/auth-overlay";
import NProgressLink from "#/components/nprogress-link";
import AppLogo from "#/components/app-logo";
import Form from "#/app//register/form";

import auth_illustration from "#/public/images/auth_illustration.png";

export const metadata = {
  title: "Регистрация | Tradify",
  description: "Tradify —	регистрация аккаунта",
};

export default function Register() {
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
          width: "40px",
          height: "40px",
          zIndex: 1,
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
            justifyContent: "center",
            flexDirection: "column",
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            m: "0px 0px 80px",
            maxWidth: "480px",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          Начните управлять своими сделками
        </Typography>
        <Box
          component="span"
          sx={{
            lineHeight: 1,
            display: "block",
            overflow: "hidden",
            position: "relative",
            maxWidth: "720px",
            zIndex: 1,
          }}
        >
          <Image src={auth_illustration} priority />
        </Box>
        <AuthOverlay />
      </Box>
      <Box
        sx={{
          width: "480px",
          m: "auto",
          display: "flex",
          minHeight: "100vh",
          justifyContent: "center",
          p: "120px 16px",
          "@media (min-width: 900px)": {
            flexShrink: 0,
            p: "144px 64px 0px",
          },
        }}
      >
        <Stack sx={{ width: "100%" }}>
          <Stack sx={{ gap: "8px", mb: "40px", position: "relative" }}>
            <Typography variant="h4">Регистрация в Tradify</Typography>
            <Stack
              sx={{
                flexDirection: "row",
                gap: "4px",
                alignItems: "center",
              }}
            >
              <Typography variant="body2">Уже есть аккаунт?</Typography>
              <NProgressLink path="/login">
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "primary.main",
                    "&:hover ": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Войти
                </Typography>
              </NProgressLink>
            </Stack>
          </Stack>
          <Form />
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              mt: "24px",
            }}
          >
            Создавая аккаунт, Вы соглашаетесь с{" "}
            <NProgressLink path="/privacy-policy">
              <Typography
                variant="caption"
                sx={{
                  color: "info.main",
                  "&:hover ": {
                    textDecoration: "underline",
                  },
                }}
              >
                политикой конфиденциальности
              </Typography>
            </NProgressLink>
            .
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
