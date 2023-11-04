import { Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Icon from "./Icon";
import { LinkedIn } from "@mui/icons-material";
import browser from "webextension-polyfill";
import MessageType from "../../../../shared/constants/message-types";
import appStore from "../../../../shared/storage/authStorage";

const GuestCard = () => {
  const [loading, setLoading] = useState(false);

  //request the AUTH URL
  async function handleAuthenticate() {
    setLoading(true);
    const message = await browser.runtime.sendMessage({ action: MessageType.START_AUTH });
    if (message.data) {
      window.location.href = message.data;
    }
  }

  //SEND THE TOKEN TO SERVER
  async function register_token(token: string) {
    setLoading(true);
    const data = await browser.runtime.sendMessage({
      action: "REGISTER_TOKEN",
      token: token,
    });
    if (data.message === "success") {
      appStore.auth(data.data);
      setLoading(false);
    }
    setLoading(false);
  }

  //CHECK IF TOKEN EXISTS IN THE URL
  useEffect(() => {
    const url = new URL(window.location.href);

    const codeValue = url.searchParams.get("code");
    if (codeValue) {
      register_token(codeValue);
      url.searchParams.delete("code");
      const newUrl = url.toString();
      history.replaceState({}, document.title, newUrl);
    }
  }, [window.location]);

  return (
    <Stack textAlign="center" alignItems="center">
      <Stack mb={1} direction="row" alignItems="center" spacing={0.5}>
        <Icon size={30} />
        <Typography fontSize={20} fontWeight={600} color="text.primary">
          ReplyRocket
        </Typography>
      </Stack>
      <Stack mb={1}>
        <Typography fontSize={18} fontWeight={500} color="text.secondary">
          Say Hello to ReplyRocket and Sign Up
        </Typography>
      </Stack>
      <Button
        disabled={loading}
        onClick={handleAuthenticate}
        sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }}
        size="small"
        variant="contained"
        startIcon={loading ? <CircularProgress size={15} /> : <LinkedIn />}
      >
        Authenticate
      </Button>
      <Stack alignItems="center" mt={2}>
        <Link fontSize={13}>Privacy Policy</Link>
        <Link fontSize={13}>Terms and Conditions</Link>
      </Stack>
    </Stack>
  );
};

export default GuestCard;
