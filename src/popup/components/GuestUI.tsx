import { LinkedIn } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import MessageType from "../../shared/constants/message-types";

const GuestUI = () => {
  function startAuth() {
    chrome.runtime.sendMessage(MessageType.START_AUTH);
  }
  return (
    <Stack spacing={2} mt={2} textAlign="center" alignItems="center" justifyContent="center">
      <Typography fontSize={15} color="text.secondary">
        Login with LinkedIn to start using Comments Rocket for free.
      </Typography>

      <Button onClick={startAuth} variant="contained" startIcon={<LinkedIn />}>
        Sign in
      </Button>
    </Stack>
  );
};

export default GuestUI;
