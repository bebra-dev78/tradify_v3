import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import LinkToPolicy from "#/components/other/footer-link-to-policy";
import AppLogo from "#/components/app-logo";

export default function RootFooter() {
  return (
    <Box component="footer" sx={{ position: "relative" }}>
      <Divider />
      <Container sx={{ pt: "80px", color: "text.primary" }}>
        <Grid
          container
          sx={{
            pb: "80px",
            flexFlow: "wrap",
            "@media (min-width: 0px)": {
              textAlign: "center",
              justifyContent: "center",
            },
            "@media (min-width: 900px)": {
              textAlign: "left",
              justifyContent: "space-between",
            },
          }}
        >
          <Grid item xs={12} sx={{ m: "0px 0px 24px" }}>
            <AppLogo />
          </Grid>
          <Grid item xs={8} md={3}>
            <Typography
              variant="body2"
              sx={{
                "@media (min-width: 900px)": {
                  pr: "40px",
                },
              }}
            >
              Современный дневник трейдера, предназначенный для улучшения
              стратегии вашей торговли.
            </Typography>
            <Stack
              sx={{
                mt: "40px",
                gap: "8px",
                flexDirection: "row",
                "@media (min-width: 0px)": {
                  mb: "40px",
                  justifyContent: "center",
                },
                "@media (min-width: 900px)": {
                  mb: "0px",
                  justifyContent: "flex-start",
                },
              }}
            >
              <Typography variant="body2" color="text.disabled">
                © 2024. Все права защищены
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack
              sx={{
                justifyContent: "space-between",
                "@media (min-width: 0px)": {
                  flexDirection: "column",
                  gap: "40px",
                },
                "@media (min-width: 900px)": {
                  flexDirection: "row",
                  gap: "40px",
                },
              }}
            >
              <Stack
                sx={{
                  gap: "16px",
                  "@media (min-width: 0px)": {
                    alignItems: "center",
                  },
                  "@media (min-width: 900px)": {
                    alignItems: "flex-start",
                  },
                }}
              >
                <Typography variant="overline">Telegram</Typography>
                <a href="https://t.me/tradifyy" target="_blank">
                  <Typography
                    variant="body2"
                    sx={{
                      "&:hover": { textDecoration: "underline" },
                      color: "text.secondary",
                    }}
                  >
                    https://t.me/tradifyy
                  </Typography>
                </a>
              </Stack>
              <Stack
                sx={{
                  gap: "16px",
                  "@media (min-width: 0px)": {
                    alignItems: "center",
                  },
                  "@media (min-width: 900px)": {
                    alignItems: "flex-start",
                  },
                }}
              >
                <Typography variant="overline">Правовая информация</Typography>
                <LinkToPolicy />
              </Stack>
              <Stack
                sx={{
                  gap: "16px",
                  "@media (min-width: 0px)": {
                    alignItems: "center",
                  },
                  "@media (min-width: 900px)": {
                    alignItems: "flex-start",
                  },
                }}
              >
                <Typography variant="overline">Связь с нами</Typography>
                <a href="mailto:support@tradify.su" target="_blank">
                  <Typography
                    variant="body2"
                    sx={{
                      "&:hover": { textDecoration: "underline" },
                      color: "text.secondary",
                    }}
                  >
                    support@tradify.su
                  </Typography>
                </a>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
