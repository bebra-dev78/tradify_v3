import Typography from "@mui/material/Typography";

import TabsWrapper from "#/layout/Account/tabs-wrapper";

export const metadata = {
  title: "Аккаунт | Tradify",
  description: "💊",
};

export default function Account() {
  return (
    <>
      <Typography variant="h4" paragraph sx={{ color: "text.primary" }}>
        Аккаунт
      </Typography>
      <TabsWrapper />
    </>
  );
}
