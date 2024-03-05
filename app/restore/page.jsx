import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import RootSecondaryHeader from "#/components/root-secondary-header";
import NProgressLink from "#/components/nprogress-link";
import Form from "#/app/restore/form";

export const metadata = {
  title: "Восстановление аккаунта | Tradify",
  description: "Tradify —	восстановление аккаунта",
};

export default function Restore() {
  return (
    <>
      <RootSecondaryHeader />
      <Container component="main">
        <Stack
          sx={{
            paddingTop: "96px",
            paddingBottom: "96px",
            margin: "auto",
            maxWidth: "400px",
            minHeight: "100vh",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Form />
          <NProgressLink
            path="/login"
            style={{
              alignItems: "center",
              textDecoration: "none",
              flexDirection: "row",
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "24px",
            }}
          >
            <ArrowBackIosNewRoundedIcon
              sx={{
                width: "12px",
                height: "12px",
                marginRight: "3px",
                color: "info.main",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                "&:hover ": {
                  textDecoration: "underline",
                },
                color: "info.main",
              }}
            >
              Вернуться на страницу входа
            </Typography>
          </NProgressLink>
        </Stack>
      </Container>
    </>
  );
}
