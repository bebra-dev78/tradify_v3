import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";

import Link from "next/link";

import Iconify from "#/utils/iconify";

export const metadata = {
  title: "Новости | Tradify",
  description: "💊",
};

const news = [
  {
    id: 2,
    md: 6,
    title: "Обновление 0.4.0",
    content:
      "Доброго времени суток, партнёры! В этом обновлении мы немного поработали над улучшением UX нашего сервиса:\n\n• В инструментах наложений свечного графика была добавлена «линейка» — она позволяет узнать изменение цены в абсолютном и процентном соотношениях.\n\n• На странице аккаунта теперь срабатывает мягкая анимация при перемещении между вкладками.\n\n• Теперь большинство переиспользуемых данных кешируются прямо на клиенте, благодаря чему можно перемещаться по страницам панели управления практически без загрузок.",
    date: "25 февраля 2024",
  },
  {
    id: 2,
    md: 6,
    title: "Обновление 0.3.0",
    content:
      "Доброго времени суток, партнёры!\n\nСервис был полноценно адаптирован к бирже Bybit, а именно — к linear фьючерсам. Теперь можно загрузить историю этих сделок за последний месяц и посмотреть их на свечном графике. В будущем мы планируем добавить больше бирж и их типы торговли.\n\nТакже была улучшена адаптивность таблицы сделок и свечного графика на мобильных устройствах.",
    date: "21 февраля 2024",
  },
  {
    id: 1,
    md: 6,
    title: "Обновление 0.2.0",
    content:
      "Доброго времени суток, партнёры! За эту неделю мы провели множество изменений в основных страницах панели управления.\n\nГлавная:\n\n• Подкорректированы значения показателей прибыли, комиссии и объёма за последние 24 часа.\n• Добавлен график, отображающий основные показатели сделок за каждый день в течение недели и их суммарные значения.\n\nСделки:\n\n• В таблицу сделок была добавлена функция настройки высоты, сама по себе таблица технически не может адаптироваться по разный размер экрана и поэтому регулировать её высоту необходимо самостоятельно. Также были добавлены различные опции над выбранными сделками в таблице.\n• Был практически полностью переделан свечной график, в результате чего он стал намного оптимизированнее и удобнее.\n\nАналитика:\n\n• Были значительно изменены структура и дизайн страницы, а также добавлена возможность создавать несколько досок и виджетов.",
    date: "14 февраля 2024",
  },
];

export default function News() {
  return (
    <>
      <Typography variant="h4" paragraph sx={{ color: "text.primary" }}>
        Новости
      </Typography>
      <Alert
        severity="info"
        icon={<Iconify icon="solar:info-square-bold" />}
        sx={{
          backgroundColor: "rgb(0, 55, 104)",
          color: "rgb(202, 253, 245)",
          mb: "50px",
          "@media (min-width: 0px)": {
            width: "100%",
          },
          "@media (min-width: 900px)": {
            width: "60%",
          },
          "@media (min-width: 1200px)": {
            width: "50%",
          },
          "@media (min-width: 1536px)": {
            width: "40%",
          },
        }}
      >
        Также все новости и информация о последних событиях сервиса есть в нашем{" "}
        <Link href="https://t.me/tradifyy" prefetch={false} target="_blank">
          <Typography
            variant="subtitle2"
            component="span"
            sx={{
              color: "error.main",
              "&:hover ": {
                textDecoration: "underline",
              },
            }}
          >
            Telegram-канале
          </Typography>
        </Link>
      </Alert>
      <Grid container spacing={3}>
        {news.map((item) => (
          <Grid key={item.id} item xs={12} md={item.md}>
            <Card>
              <CardHeader
                title={item.title}
                subheader={
                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Iconify
                      icon="solar:calendar-date-bold-duotone"
                      width="16px"
                      sx={{ marginRight: "5px", marginTop: "-2px" }}
                    />
                    {item.date}
                  </Typography>
                }
                subheaderTypographyProps={{
                  sx: { m: "4px 0 0", display: "flex", alignItems: "center" },
                }}
                sx={{ p: "24px 24px 0px" }}
              />
              <CardContent sx={{ p: "24px 24px 0px" }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {item.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
