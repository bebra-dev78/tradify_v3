import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import RootPrimaryHeader from "#/client/Shared/root-primary-header";
import SmoothAnimation from "#/client/FAQ/smooth-animation";
import RootOverlay from "#/client/Shared/root-overlay";
import RootFooter from "#/client/Shared/root-footer";
import Iconify from "#/utils/iconify";

export const metadata = {
  title: "FAQ | Tradify",
  description: "💊",
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
                variant="subtitle1"
                gutterBottom
                sx={{ marginBottom: "16px", color: "text.primary" }}
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
                  <Typography variant="body1">Крипта</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    крипта крипта бабосики
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 3 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ marginBottom: "16px", color: "text.primary" }}
              >
                Работа с сервисом
              </Typography>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  <Typography variant="body1">
                    Как скачать днеуник трецдера?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Occaecati est et illo quibusdam accusamus qui. Incidunt aut
                    et molestiae ut facere aut. Est quidem iusto praesentium
                    excepturi harum nihil tenetur facilis. Ut omnis voluptates
                    nihil accusantium doloribus eaque debitis.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="solar:alt-arrow-down-bold-duotone" />
                  }
                >
                  <Typography variant="body1">Куда нажимать?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    😄😁😭😵😵‍💫😳🤨🤎😈🙀😼☠😈💨🦾🧑‍🏫🧠💫💫💬👄🧑‍🏫🙋🦹👳🦸🕺🐄🐄🦬🐲🍓🍅🍪🍾🍧🍤🥃🛣🛼⛄🌖⚡🎨👖👛
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
