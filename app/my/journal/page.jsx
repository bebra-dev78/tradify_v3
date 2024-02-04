import Typography from "@mui/material/Typography";

export const metadata = {
  title: "Журнал | Tradify",
  description: "💊",
};

export default function Journal() {
  return (
      <Typography variant="h4" paragraph sx={{ color: "text.primary" }}>
        Журнал
      </Typography>
  );
}
