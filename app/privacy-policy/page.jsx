import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import RootPrimaryHeader from "#/client/Shared/root-primary-header";
import RootOverlay from "#/client/Shared/root-overlay";
import RootFooter from "#/client/Shared/root-footer";

export const metadata = {
  title: "Политика конфиденциальности | Tradify",
  description: "💊",
};

export default function Policy() {
  return (
    <>
      <RootPrimaryHeader />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          "@media (min-width: 0px)": {
            paddingTop: "64px",
          },
          "@media (min-width: 900px)": {
            paddingTop: "80px",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            p: "80px 0px",
          }}
        >
          <Container
            sx={{
              p: "40px 0px",
              "@media (min-width: 900px)": {
                display: "flex",
                justifyContent: "space-between",
              },
            }}
          >
            <Stack
              sx={{
                "@media (max-width: 900px)": {
                  textAlign: "center",
                },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  zIndex: 1,
                  color: "text.primary",
                  "@media (max-width: 600px)": {
                    fontSize: "2.25rem",
                  },
                  "@media (max-width: 360px)": {
                    fontSize: "2rem",
                  },
                }}
              >
                Политика
              </Typography>
              <Typography
                variant="h1"
                component="span"
                sx={{
                  color: "primary.main",
                  zIndex: 1,
                  "@media (max-width: 600px)": {
                    fontSize: "2rem",
                  },
                  "@media (max-width: 360px)": {
                    fontSize: "1.75rem",
                  },
                }}
              >
                конфиденциальности
              </Typography>
            </Stack>
          </Container>
          <RootOverlay />
        </Box>
        <Container
          sx={{
            paddingTop: "160px",
            paddingBottom: "160px",
            color: "text.primary",
          }}
        >
          <Typography variant="body1">
            Настоящая Политика конфиденциальности персональных данных (далее –
            Политика конфиденциальности) действует в отношении всей информации,
            которую сайт, может получить о Пользователе во время использования
            сайта. Используя сайт и (или) оставляя свои персональные данные на
            сайте, Пользователь выражает свое согласие на использование данных
            на условиях, изложенных в настоящей Политике конфиденциальности.
            Отношения, связанные со сбором, хранением, распространением и
            защитой информации, предоставляемой Пользователем, регулируются
            настоящей Политикой и действующим законодательством Российской
            Федерации. В случае несогласия Пользователя с условиями настоящей
            Политики использование сайта должно быть немедленно прекращено.
          </Typography>
        </Container>
      </Box>
      <RootFooter />
    </>
  );
}
