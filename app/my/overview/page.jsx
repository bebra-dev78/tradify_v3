import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import Image from "next/image";
import Link from "next/link";

import { TimeLastNews, ButtonToNews } from "#/layout/Overview/last-news";
import InviteItemButton from "#/layout/Overview/invite-item-button";
import StatisticsItem from "#/layout/Overview/statistics-item";
import CommissionItem from "#/layout/Overview/commission-item";
import WelcomeItem from "#/layout/Overview/welcome-item";
import VolumeItem from "#/layout/Overview/volume-item";
import ProfitItem from "#/layout/Overview/profit-item";
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
        <Grid item xs={12} md={4}>
          <ProfitItem />
        </Grid>
        <Grid item xs={12} md={4}>
          <CommissionItem />
        </Grid>
        <Grid item xs={12} md={4}>
          <VolumeItem />
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <StatisticsItem />
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <Card>
            <CardHeader
              title="Обновление 0.4.0"
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
                Доброго времени суток, партнёры! В этом обновлении мы немного
                поработали над улучшением UX нашего сервиса:
                <br />
                <br />• В инструментах наложений свечного графика была добавлена
                «линейка» — она позволяет узнать изменение цены в абсолютном и
                процентном соотношениях.
                <br />
                <br />• На странице аккаунта теперь срабатывает мягкая анимация
                при перемещении между вкладками.
                <br />
                <br />• Теперь большинство переиспользуемых данных кешируются
                прямо на клиенте, благодаря чему можно перемещаться по страницам
                панели управления практически без загрузок.
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
              background:
                "linear-gradient(135deg, rgb(118, 53, 220), rgb(67, 26, 158))",
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
