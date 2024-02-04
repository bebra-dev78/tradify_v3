import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Link from "next/link";

import LinkToPolicy from "#/client/Other/footer-link-to-policy";
import AppLogo from "#/client/Shared/app-logo";

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
              Современный днеуник трецдера крипта крипта бабосики 암호 화폐 상인
              일기 섹스 토마토 푸틴 암호 화폐 상인
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
              <Typography variant="body2">
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
                <Typography variant="overline">Tradify</Typography>
                <Link
                  href="https://t.me/tradifyy"
                  prefetch={false}
                  target="_blank"
                >
                  <Typography
                    variant="body2"
                    sx={{
                      "&:hover": { textDecoration: "underline" },
                      color: "text.secondary",
                    }}
                  >
                    https://t.me/tradifyy
                  </Typography>
                </Link>
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
                <Link
                  href="mailto:support@tradify.su"
                  prefetch={false}
                  target="_blank"
                >
                  <Typography
                    variant="body2"
                    sx={{
                      "&:hover": { textDecoration: "underline" },
                      color: "text.secondary",
                    }}
                  >
                    support@tradify.su
                  </Typography>
                </Link>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
