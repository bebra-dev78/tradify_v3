import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import Grid from "@mui/material/Grid";

import Iconify from "#/utils/iconify";

export const metadata = {
  title: "FAQ | Tradify",
  description: "💊",
};

export default function FAQ() {
  return (
    <>
      <Typography variant="h4" paragraph sx={{ color: "text.primary" }}>
        Часто задаваемые вопросы
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "text.primary", marginBottom: "16px" }}
          >
            Термины
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
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
              expandIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
            >
              <Typography variant="body1">Крипта</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">крипта мрипта Бабосики</Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} sx={{ paddingTop: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "text.primary", marginBottom: "16px" }}
          >
            Работа с сервисом
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
            >
              <Typography variant="body1">
                Как скачать днеуник трецдера?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Occaecati est et illo quibusdam accusamus qui. Incidunt aut et
                molestiae ut facere aut. Est quidem iusto praesentium excepturi
                harum nihil tenetur facilis. Ut omnis voluptates nihil
                accusantium doloribus eaque debitis.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
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
    </>
  );
}
