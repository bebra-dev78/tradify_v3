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
              title="Обновление 0.2.0"
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
                Доброго времени суток, партнёры! За эту неделю мы провели
                множество изменений в основных страницах панели управления.
                <br />
                <br />
                Главная:
                <br />
                <br />• Подкорректированы значения показателей прибыли, комиссии
                и объёма за последние 24 часа.
                <br />• Добавлен график, отображающий основные показатели сделок
                за каждый день в течение недели и их суммарные значения.
                <br />
                <br />
                Сделки:
                <br />
                <br />• В таблицу сделок была добавлена функция настройки
                высоты, сама по себе таблица технически не может адаптироваться
                по разный размер экрана и поэтому регулировать её высоту
                необходимо самостоятельно. Также были...
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
