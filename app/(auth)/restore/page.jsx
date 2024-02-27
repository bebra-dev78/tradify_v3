import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import RootSecondaryHeader from "#/client/Shared/root-secondary-header";
import LinkToLogin from "#/client/Restore/links";
import Form from "#/client/Restore/form";

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
          <LinkToLogin />
        </Stack>
      </Container>
    </>
  );
}
