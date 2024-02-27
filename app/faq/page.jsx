import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Link from "next/link";

import RootPrimaryHeader from "#/client/Shared/root-primary-header";
import SmoothAnimation from "#/client/FAQ/smooth-animation";
import RootOverlay from "#/client/Shared/root-overlay";
import RootFooter from "#/client/Shared/root-footer";
import Iconify from "#/utils/iconify";

export const metadata = {
  title: "FAQ | Tradify",
  description: "Tradify —	часто задаваемые вопросы",
};

export default function RootFAQ() {
  return (
    <>
      <RootPrimaryHeader />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          "@media (min-width: 0px)": {
            pt: "64px",
          },
          "@media (min-width: 900px)": {
            pt: "80px",
          },
        }}
      >
        <Box sx={{ position: "relative", p: "80px 0px" }}>
          <Container
            sx={{
              "@media (min-width: 900px)": {
                display: "flex",
                justifyContent: "space-between",
              },
            }}
          >
            <SmoothAnimation />
          </Container>
          <RootOverlay />
        </Box>
        <Container sx={{ marginTop: "80px", marginBottom: "80px" }}>
          <Grid container xs={3} sx={{ maxWidth: "100% !important" }}>
            <Grid item xs={12} md={12}>
              <Typography
                gutterBottom
                variant="subtitle1"
                sx={{ marginBottom: "16px", color: "text.secondary" }}
              >
                Термины
              </Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  <Typography variant="body1">Что такое трейдинг?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Трейдинг — это الطماطم التداول عملة معماة الموت الجنس الحصاد
                    روسيا بوتين
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  <Typography variant="body1">Сделки</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Сделка - это собранные по определённому алгоритму трейды,
                    которые вы совершаете на бирже. Данные любой сделки
                    образуются из присвоенных ей трейдов, а границы сделки
                    (время входа и время выхода) определяются открывающим и
                    закрывающим позицию трейдами.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 3 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ marginBottom: "16px", color: "text.secondary" }}
              >
                Работа с сервисом
              </Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  <Typography variant="body1">Верификация</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Чтобы верифицировать аккаунт зарегистрируйтесь в сервисе и
                    перейдите на{" "}
                    <Link href="https://mail.google.com/" target="_blank">
                      <Typography
                        component="strong"
                        sx={{
                          "&:hover": { textDecoration: "underline" },
                          color: "info.main",
                        }}
                      >
                        https://mail.google.com/
                      </Typography>
                    </Link>
                    . Вам будет отправлено письмо с подтверждением и ссылкой,
                    после нажатия на которую ваш аккаунт станет верифицированным
                    и вы сможете пользоваться сервисом без ограничений.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  <Typography variant="body1">
                    Как добавить API-ключ?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Перейдите на страницу{" "}
                    <Link href="my/account/" target="_blank">
                      <Typography
                        component="span"
                        sx={{
                          "&:hover": { textDecoration: "underline" },
                          color: "info.main",
                        }}
                      >
                        Аккаунт
                      </Typography>
                    </Link>{" "}
                    и во вкладке "Ключи" добавьте новый API-ключ от
                    криптовалютной биржи, заполнив поля диалоговой формы. После
                    ввода ключ добавится и начнётся загрузка сделок от выбранной
                    биржи за последние 30 дней.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <RootFooter />
    </>
  );
}
