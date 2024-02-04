import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import Script from "next/script";

import RootSecondaryHeader from "#/client/Shared/root-secondary-header";
import BackButton from "#/client/Other/back-button";

export const metadata = {
  title: "Страница не найдена | Tradify",
  description: "💊",
};

export default function NotFound() {
  return (
    <>
      <RootSecondaryHeader />
      <Container component="main">
        <Stack
          sx={{
            m: "auto",
            maxWidth: "400px",
            minHeight: "100vh",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3" paragraph sx={{ color: "text.primary" }}>
            Извините, страница не найдена!
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Извините, нам не удалось найти страницу, которую вы ищете. Возможно,
            вы неправильно ввели URL-адрес?
          </Typography>
          <Box
            sx={{
              m: "30px auto",
            }}
          >
            <Script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.3/dist/tgs-player.js" />
            <tgs-player
              autoplay
              loop
              mode="normal"
              src="/video/duck_not_found.tgs"
              style={{ height: "250px", width: "250px" }}
            />
          </Box>
          <BackButton />
        </Stack>
      </Container>
    </>
  );
}
