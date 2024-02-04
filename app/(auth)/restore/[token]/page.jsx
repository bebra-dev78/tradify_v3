import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import RootSecondaryHeader from "#/client/Shared/root-secondary-header";
import Form from "#/client/Restore/Reset/token-form";

export const metadata = {
  title: "Сброс пароля | Tradify",
  description: "💊",
};

export default function Reset({ params, searchParams }) {
  return (
    <>
      <RootSecondaryHeader />
      <Box
        component="main"
        sx={{
          display: "flex",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          padding: "96px 0px",
        }}
      >
        <Container>
          <Box
            sx={{
              maxWidth: "480px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Form token={params.token} email={searchParams.email} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
