import React, { useEffect, useState } from "react";
import { Stack, Paper, Typography, Button, LinearProgress, Divider } from "@mui/material";
import appStorage, { AppStorageType } from "../../../../../shared/storage/appStorage";
import PromptForm from "./PromptForm";
import browser from "webextension-polyfill";
import MessageType from "../../../../../shared/constants/message-types";
import useStorage from "../../../../../shared/hooks/useStorage";
import PromptCard from "./PromptCard";

const Prompts = () => {
  const { prompts }: AppStorageType = useStorage(appStorage);

  function handleFormOpen() {
    appStorage.openPromptForm(false);
  }

  const [fetching, setFetching] = useState(false);

  async function getPrompts() {
    setFetching(true);
    const message = await browser.runtime.sendMessage({
      action: MessageType.GET_PROMPTS,
    });

    if (message.message === "success") {
      appStorage.getPrompts(message.data);
    }
    setFetching(false);
  }
  useEffect(() => {
    getPrompts();
  }, []);

  return (
    <Stack>
      <PromptForm />
      <Stack mb={1} direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontSize={20} fontWeight={600}>
          Prompts
        </Typography>

        <Button variant="contained" onClick={handleFormOpen}>
          Add Prompts
        </Button>
      </Stack>
      <Divider />
      {fetching && <LinearProgress />}
      <Stack pt={1} spacing={1} sx={{ maxHeight: 470, overflowY: "auto" }}>
        {prompts.map((p) => (
          <PromptCard key={p._id} prompt={p} />
        ))}
      </Stack>
      <Stack alignItems="flex-start"></Stack>
      <Paper variant="outlined"></Paper>
    </Stack>
  );
};

export default Prompts;
