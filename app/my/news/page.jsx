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
    id: 5,
    md: 6,
    title: "Лютый пиздец!",
    content: [
      "Алексей Навальный вхлам объебался мефедрона",
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo veritatis ipsa consequatur alias beatae tempore enim tenetur dolores amet? Sit!",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
    ],
    timestamp: "14 января 2024",
  },
  {
    id: 4,
    md: 6,
    title: "Лютый пиздец!",
    content: [
      "Алексей Навальный вхлам объебался мефедрона",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
    ],
    timestamp: "6 января 2024",
  },
  {
    id: 3,
    md: 6,
    title: "Лютый пиздец!",
    content: [
      "Алексей Навальный вхлам объебался мефедрона",
      "Алексей Навальный вхлам объебался мефедрона",
      "Алексей Навальный вхлам объебался мефедрона",
      "Алексей Навальный вхлам объебался мефедрона",
      "Алексей Навальный вхлам объебался мефедрона",
      "Алексей Навальный вхлам объебался мефедрона",
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo veritatis ipsa consequatur alias beatae tempore enim tenetur dolores amet? Sit!",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
    ],
    timestamp: "15 декаюря 2023",
  },
  {
    id: 2,
    md: 6,
    title: "Лютый пиздец!",
    content: [
      "Алексей Навальный вхлам объебался мефедрона",
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo veritatis ipsa consequatur alias beatae tempore enim tenetur dolores amet? Sit!",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
    ],
    timestamp: "24 февраля 2023",
  },
  {
    id: 1,
    md: 12,
    title: "Лютый пиздец!",
    content: [
      "Алексей Навальный вхлам объебался мефедрона",
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo veritatis ipsa consequatur alias beatae tempore enim tenetur dolores amet? Sit! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo veritatis ipsa consequatur alias beatae tempore enim tenetur dolores amet?",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eius consequatur assumenda distinctio inventore impedit ea adipisci facilis qui quam, pariatur quas nostrum, amet explicabo omnis quis rerum itaque aliquam.",
    ],
    timestamp: "7 октября 2023",
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
                    {item.timestamp}
                  </Typography>
                }
                subheaderTypographyProps={{
                  sx: { m: "4px 0 0", display: "flex", alignItems: "center" },
                }}
                sx={{ p: "24px 24px 0px" }}
              />
              <CardContent sx={{ p: "24px 24px 0px" }}>
                {item.content.map((paragraph, index) => (
                  <Typography key={index} variant="body1" paragraph>
                    {paragraph}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
