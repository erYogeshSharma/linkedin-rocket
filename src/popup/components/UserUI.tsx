import React from "react";
import { User } from "../../shared/types/user";
import { Stack, Typography } from "@mui/material";

const UserUI = (props: { user: User }) => {
  const { user } = props;
  return (
    <Stack p={1}>
      <Typography>Welcome {user.firstName}! </Typography>
    </Stack>
  );
};

export default UserUI;
