import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import Script from "next/script";
import Image from "next/image";

import { MainButtons, FooterButtons } from "#/client/Landing/link-buttons";
import SmoothAnimation from "#/client/Landing/smooth-animation";
import RootHeader from "#/client/Shared/root-primary-header";
import FooterBox from "#/client/Landing/box-footer";
import MainBox from "#/client/Landing/box-main";
import Overlay from "#/client/Landing/overlay";
import AppLogo from "#/client/Shared/app-logo";

import versatility from "#/public/svg/versatility.svg";
import complexity from "#/public/svg/complexity.svg";
import tools from "#/public/svg/tools.svg";

export const metadata = {
  title: "Tradify — современный дневник трейдера",
  description:
    "Революционный дневник трейдера, предназначенный для улучшения стратегии вашей торговли. Регистрируйтесь, подключайте криптобиржи и ведите детальный журнал сделок – всё в одном месте для успешного трейдинга",
};

export default function Landing() {
  return (
    <>
      <RootHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <div>
          <Overlay>
            <Container>
              <Grid container sx={{ alignItems: "center" }}>
                <Grid item xs={12} md={6}>
                  <Stack
                    sx={{
                      m: "auto",
                      pt: "120px",
                      pb: "120px",
                      gap: "40px",
                      zIndex: "10",
                      maxWidth: "520px",
                      position: "relative",
                      textAlign: "center",
                      color: "text.primary",
                      "@media (max-width: 899px)": {
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        display: "flex",
                      },
                      "@media (min-width: 900px)": {
                        m: "unset",
                        textAlign: "left",
                      },
                    }}
                  >
                    <SmoothAnimation />
                    <Stack
                      sx={{
                        "@media (min-width: 0px)": {
                          gap: "12px",
                          flexDirection: "column-reverse",
                        },
                        "@media (min-width: 600px)": {
                          gap: "12px",
                          flexDirection: "row",
                        },
                      }}
                    >
                      <MainButtons />
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={0} md={6}>
                  <Box
                    sx={{
                      mt: "40px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <tgs-player
                      autoplay
                      loop
                      mode="normal"
                      src="/video/genshin_gamer.tgs"
                      style={{ height: "250px", width: "250px" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Container>
            <Box
              sx={{
                top: 0,
                right: 0,
                width: "480px",
                height: "480px",
                borderRadius: "50%",
                position: "absolute",
                WebkitFilter: "blur(100px)",
                backgroundColor: "rgba(6, 27, 100, 0.12)",
                "@media (min-width: 900px)": {
                  top: "-80px",
                  right: "-80px",
                },
              }}
            />
            <Box
              sx={{
                top: "10%",
                right: "10%",
                height: "400px",
                bottom: "-200px",
                borderRadius: "50%",
                position: "absolute",
                WebkitFilter: "blur(100px)",
                backgroundColor: "rgba(6, 27, 100, 0.08)",
              }}
            />
          </Overlay>
          <Box
            sx={{
              "@media (min-width: 900px)": {
                height: "100vh",
              },
            }}
          />
        </div>
        <MainBox>
          <Box
            sx={{
              p: "80px 0px",
              "@media (min-width: 900px)": { p: "120px 0px" },
            }}
          >
            <Container>
              <Box
                sx={{
                  textAlign: "center",
                  "@media (min-width: 0px)": {
                    mb: "80px",
                  },
                  "@media (min-width: 900px)": {
                    mb: "200px",
                  },
                }}
              >
                <Typography
                  variant="overline"
                  component="div"
                  sx={{
                    m: "0 0 16px",
                    color: "text.secondary",
                  }}
                >
                  Почему же мы?
                </Typography>
                <Typography variant="h2" sx={{ color: "text.primary" }}>
                  Наши главные преимущества
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  "@media (min-width: 0px)": {
                    gap: "40px",
                    gridTemplateColumns: "repeat(1, 1fr)",
                  },
                  "@media (min-width: 900px)": {
                    gridTemplateColumns: "repeat(3, 1fr)",
                  },
                  "@media (min-width: 1200px)": {
                    gap: "80px",
                  },
                }}
              >
                <Card
                  sx={{
                    zIndex: 0,
                    p: "80px 40px",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    "@media (min-width: 900px)": {
                      boxShadow: "none",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      mb: "80px",
                      ml: "auto",
                      mr: "auto",
                      width: "40px",
                      height: "40px",
                      lineHeight: 1,
                      display: "block",
                      overflow: "hidden",
                      position: "relative",
                      filter:
                        "drop-shadow(2px 2px 2px rgba(0, 184, 217, 0.48))",
                    }}
                  >
                    <Image src={versatility} alt="Универсальность" />
                  </Box>
                  <Typography variant="h5" paragraph>
                    Универсальность
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Мы предоставляем возможность интеграции сразу с несколькими
                    криптобиржами через API в одном аккаунте бесплатно. Без
                    альтернатив, подобных нам.
                  </Typography>
                </Card>
                <Card
                  sx={{
                    zIndex: 0,
                    p: "80px 40px",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    "@media (min-width: 900px)": {
                      boxShadow: "rgba(0, 0, 0, 0.4) -40px 40px 80px",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      mb: "80px",
                      ml: "auto",
                      mr: "auto",
                      width: "40px",
                      height: "40px",
                      lineHeight: 1,
                      display: "block",
                      overflow: "hidden",
                      position: "relative",
                      filter:
                        "drop-shadow(2px 2px 2px rgba(255, 86, 48, 0.48))",
                    }}
                  >
                    <Image src={tools} alt="Простые инструменты" />
                  </Box>
                  <Typography variant="h5" paragraph>
                    Простые инструменты
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Множество виджетов, подробная аналитика, мобильная адаптация
                    и интуитивно-понятный интерфейс в нашей панели управления.
                  </Typography>
                </Card>
                <Card
                  sx={{
                    zIndex: 0,
                    p: "80px 40px",
                    textAlign: "center",
                    backgroundColor: "transparent",

                    "@media (min-width: 900px)": {
                      boxShadow: "none",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      mb: "80px",
                      ml: "auto",
                      mr: "auto",
                      width: "40px",
                      height: "40px",
                      lineHeight: 1,
                      display: "block",
                      overflow: "hidden",
                      position: "relative",
                      filter:
                        "drop-shadow(2px 2px 2px rgba(54, 179, 126, 0.48))",
                    }}
                  >
                    <Image src={complexity} alt="Комплексность" />
                  </Box>
                  <Typography variant="h5" paragraph>
                    Комплексность
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Сервис крупно интегрирован со множеством криптовалютных
                    бирж, таких как Binance и Bybit, для комплексной работы над
                    любыми видами торговли.
                  </Typography>
                </Card>
              </Box>
            </Container>
          </Box>
          <Container>
            <Box
              sx={{
                m: "auto",
                pb: "80px",
                maxWidth: "456px",
                overflow: "hidden",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgb(118, 53, 220), rgb(67, 26, 158))",
                "@media (min-width: 900px)": {
                  display: "flex",
                  maxWidth: "100%",
                  pb: "30px",
                  pt: "30px",
                  alignItems: "center",
                },
              }}
            >
              <Stack
                sx={{
                  alignItems: "center",
                }}
              >
                <tgs-player
                  autoplay
                  loop
                  mode="normal"
                  src="/video/rocket.tgs"
                  style={{ height: "250px", width: "250px" }}
                />
              </Stack>
              <Box
                sx={{
                  ml: "16px",
                  mr: "16px",
                  "@media (min-width: 0px)": {
                    textAlign: "center",
                  },
                  "@media (min-width: 900px)": {
                    pl: "80px",
                    textAlign: "left",
                  },
                }}
              >
                <Box sx={{ mb: "24px" }}>
                  <Typography variant="h2" paragraph>
                    Начните уже
                    <br />
                    сейчас
                  </Typography>
                  <Typography variant="body1">
                    Здесь, в этом сервисе, мы собрали всё, чтобы Вам было
                    комфортно. Каждая страница веб-приложения и каждая
                    внутренняя служба проекта выполнена людьми, влюблёнными в
                    своё дело.
                  </Typography>
                </Box>
                <Stack
                  sx={{
                    "@media (min-width: 0px)": {
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "16px",
                    },
                    "@media (min-width: 900px)": {
                      justifyContent: "flex-start",
                      flexDirection: "row",
                      gap: "16px",
                    },
                  }}
                >
                  <FooterButtons />
                </Stack>
              </Box>
            </Box>
          </Container>
        </MainBox>
      </Box>
      <FooterBox>
        <Container>
          <Box
            sx={{
              mb: "8px",
              ml: "auto",
              mr: "auto",
            }}
          >
            <AppLogo />
          </Box>
          <Typography variant="caption" sx={{ color: "text.primary" }}>
            © Все права защищены
            <br />
            made by
            <Typography variant="span" sx={{ color: "primary.main" }}>
              {" "}
              Tradify
            </Typography>
          </Typography>
        </Container>
      </FooterBox>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.3/dist/tgs-player.js" />
    </>
  );
}
