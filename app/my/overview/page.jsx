import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import Image from "next/image";
import Link from "next/link";

import { TimeLastNews, ButtonToNews } from "#/client/My/Overview/last-news";
import GridWrapperItems from "#/client/My/Overview/grid-wrapper-items";
import InviteItemButton from "#/client/My/Overview/invite-item-button";
import WelcomeItem from "#/client/My/Overview/welcome-item";
import Iconify from "#/utils/iconify";

import woman_2 from "#/public/images/woman_2.png";

export const metadata = {
  title: "Главная | Tradify",
  description: "💊",
};

export default function Overview() {
  return (
    <Box
      sx={{
        maxWidth: "1200px",
        "@media (min-width: 600px)": {
          ml: "auto",
          mr: "auto",
        },
      }}
    >
      <WelcomeItem />
      <Grid container spacing={3} sx={{ flexFlow: "wrap" }}>
        <GridWrapperItems />
        <Grid item xs={12} md={6} xl={6}>
          <Card>
            <CardHeader
              title="Обновление 0.1.0"
              subheader={
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    textAlign: "center",
                    alignItems: "center",
                    color: "text.secondary",
                  }}
                >
                  <Iconify
                    icon="solar:clock-circle-bold"
                    width="16px"
                    sx={{ marginRight: "5px", marginTop: "-2px" }}
                  />
                  <TimeLastNews /> назад
                </Typography>
              }
              subheaderTypographyProps={{
                sx: { m: "4px 0 0", display: "flex", alignItems: "center" },
              }}
              sx={{ padding: "24px 24px 0px" }}
            />
            <CardContent sx={{ padding: "24px" }}>
              <Typography
                sx={{
                  paddingBottom: "16px",
                  whiteSpace: "pre-line",
                  textOverflow: "ellipsis",
                }}
              >
                Доброго времени суток, партнеры!
                <br />
                <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Adipisci nulla tempora, perspiciatis ab error aut sequi dicta
                necessitatibus aliquam incidunt eveniet eum! Labore,
                <br />
                <br />
                necessitatibus quam. Tempore, eveniet voluptate enim quo tenetur
                nam temporibus quod eaque distinctio incidunt quaerat quis
                soluta itaque dolores labore laboriosam harum officiis error qui
                quam aperiam dolor unde odio! Est libero fugiat quod eveniet
                <br />
                <br />
                et! Corporis alias cum expedita quia sint nisi voluptates quam
                provident quibusdam. Obcaecati autem earum illo voluptate quis
                veniam et in aliquam, incidunt sit sunt.
                <br />
              </Typography>
              <Link href="/my/news">
                <ButtonToNews />
              </Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="span"
            sx={{
              zIndex: 1,
              left: "40px",
              position: "relative",
              filter: "drop-shadow(rgba(0, 0, 0, 0.24) 0px 12px 24px)",
            }}
          >
            <Image src={woman_2} height={202} width={140} />
          </Box>
          <Card
            sx={{
              marginTop: "-120px",
              padding: "128px 40px 40px",
              color: "rgb(255, 255, 255)",
              backgroundImage:
                "linear-gradient(135deg, rgb(32, 101, 209) 0%, rgb(16, 57, 150) 100%)",
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4">
                Приглашай друзей
                <br />и получай бонусы
              </Typography>
              <Typography variant="h2">78%</Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                margin: "16px 0px 24px",
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              harum, recusandae pariatur itaque doloribus debitis. Autem dolorem
              voluptate explicabo quaerat.
            </Typography>
            <Link href="/my/referrals">
              <InviteItemButton />
            </Link>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
