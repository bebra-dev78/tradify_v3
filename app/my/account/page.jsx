import Typography from "@mui/material/Typography";

import TabsWrapper from "#/client/My/Account/tabs-wrapper";

export const metadata = {
  title: "Аккаунт | Tradify",
  description: "💊",
};

export default function Account() {
  return (
    <>
      <Typography variant="h4" paragraph>
        Аккаунт
      </Typography>
      <TabsWrapper />
    </>
  );
}
