import { Comment, Settings } from "@mui/icons-material";
import { Divider, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Stack>
      <Divider />
      <Stack p={1} direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={1} direction="row" alignItems="center">
          <Typography fontSize={13} fontWeight={600}>
            2/4
          </Typography>
          <Comment sx={{ fontSize: 20 }} color="primary" />
        </Stack>
        <IconButton size="small">
          <Settings sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default Footer;
