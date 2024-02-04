"use client";

import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import { useUser } from "#/app/my/layout";

export default function TabProfileUserAvatarItem() {
  const { user } = useUser();

  return (
    <>
      <Avatar
        sx={{
          m: "auto",
          width: "115px",
          height: "115px",
          fontSize: "3.5rem",
        }}
      >
        {user.name?.charAt(0).toUpperCase()}
      </Avatar>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          m: "21px auto 0",
        }}
      >
        {user.email ?? "."}
      </Typography>
      <Typography variant="subtitle1">
        {user.name ?? "."} {user.surname}
      </Typography>
    </>
  );
}
