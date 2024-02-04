"use client";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { useState } from "react";

import TabProfileUserAvatarItem from "#/client/My/Account/tab-profile-user-avatar-item";
import TabProfileUserEditItem from "#/client/My/Account/tab-profile-user-edit-item";
import TabKeysAddKeyPanel from "#/client/My/Account/tab-keys-add-key-panel";
import TabKeysContainer from "#/client/My/Account/tab-keys-container";
import TabSecurity from "#/client/My/Account/tab-security";

export default function TabsContent({ value }) {
  const [loadingTrades, setLoadingTrades] = useState({
    id: null,
    status: false,
  });

  switch (value) {
    case 0:
      return (
        <Grid container spacing={3} sx={{ flexFlow: "wrap" }}>
          <Grid item xs={12} md={4}>
            <Card>
              <Stack sx={{ p: "48px 24px", textAlign: "center" }}>
                <TabProfileUserAvatarItem />
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                p: "24px",
              }}
            >
              <TabProfileUserEditItem />
            </Card>
          </Grid>
        </Grid>
      );
    case 1:
      return (
        <>
          <Grid container spacing={5} sx={{ flexFlow: "wrap" }}>
            <Grid item xs={12} md={8}>
              <Stack sx={{ gap: 3 }}>
                <Card
                  sx={{
                    p: 3,
                  }}
                >
                  <Typography
                    variant="overline"
                    component="span"
                    sx={{
                      color: "text.secondary",
                      mb: 3,
                    }}
                  >
                    Добавить API-ключ
                  </Typography>
                  <TabKeysAddKeyPanel setLoadingTrades={setLoadingTrades} />
                </Card>
              </Stack>
            </Grid>
          </Grid>
          <TabKeysContainer
            loadingTrades={loadingTrades}
            setLoadingTrades={setLoadingTrades}
          />
        </>
      );
    case 2:
      return (
        <Grid container spacing={3} sx={{ flexFlow: "wrap" }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" paragraph sx={{ color: "text.primary" }}>
                Изменить пароль
              </Typography>
              <Stack sx={{ gap: 3, alignItems: "flex-end" }}>
                <TabSecurity />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      );
    default:
      break;
  }
}
