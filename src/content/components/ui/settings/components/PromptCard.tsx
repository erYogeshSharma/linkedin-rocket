import React, { useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Popover,
  Divider,
  Switch,
  CircularProgress,
} from "@mui/material";
import appStorage, { Prompt } from "../../../../../shared/storage/appStorage";
import browser from "webextension-polyfill";
import MessageType from "../../../../../shared/constants/message-types";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import authStorage, { AuthStorageType } from "../../../../../shared/storage/authStorage";
import useStorage from "../../../../../shared/hooks/useStorage";

const PromptCard = (props: { prompt: Prompt }) => {
  const { prompt } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [deleting, setDeleting] = useState(false);
  const user: AuthStorageType = useStorage(authStorage);

  const [changingStatus, setChangingStatus] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handlePromptStatus() {
    let message;
    const isActive = !user.user.disabledDefaultPrompts.includes(prompt._id);
    setChangingStatus(true);
    if (prompt.isDefault) {
      message = await browser.runtime.sendMessage({
        action: MessageType.DISABLE_DEFAULT_PROMPT,
        prompt: {
          promptId: prompt._id,
          isActive: !isActive,
        },
      });
      if (message.message === "success") {
        authStorage.updateDefaultPrompts(message.data);
      }
    } else {
      message = await browser.runtime.sendMessage({
        action: MessageType.UPDATE_PROMPT,
        prompt: {
          isActive: !prompt.isActive,
          _id: prompt._id,
        },
      });
      if (message.message === "success") {
        appStorage.updatePrompt(message.data);
      }
    }
    setChangingStatus(false);
  }
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  async function handleDelete() {
    setDeleting(true);
    const message = await browser.runtime.sendMessage({
      action: MessageType.DELETE_PROMPT,
      promptId: prompt._id,
    });

    if (message.message === "success") {
      appStorage.removePrompt(prompt._id);
    }
    setDeleting(false);
    handleClose();
  }

  function handleEditOpen() {
    appStorage.openPromptForm(true, prompt);
  }

  function getPromptStatus() {
    if (prompt.isDefault) {
      return !user.user.disabledDefaultPrompts.includes(prompt._id);
    } else {
      return prompt.isActive;
    }
  }
  return (
    <Paper variant="outlined">
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" px={1} pt={1}>
            <Typography fontSize={17} fontWeight={600}>
              Are you sure want to delete this Prompt?
            </Typography>
          </Stack>
          <Divider />
          <Stack
            px={1}
            pb={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            spacing={1}
          >
            <Button onClick={handleClose} size="small" variant="outlined">
              No, Cancel
            </Button>
            <LoadingButton
              size="small"
              onClick={handleDelete}
              loading={deleting}
              variant="contained"
            >
              Yes, Delete
            </LoadingButton>
          </Stack>
        </Stack>
      </Popover>
      <Stack p={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography color="text.primary" fontWeight={600} fontSize={18}>
              {prompt.label}
            </Typography>
          </Stack>
          <Typography fontSize={15}>
            <b>Word Limit</b>&nbsp;
            {">"} {prompt.wordLimit}
          </Typography>
        </Stack>
        <Typography color="text.secondary" fontWeight={500} fontSize={15}>
          <b>Prompt:</b> {prompt.prompt}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
            <Tooltip title={prompt.isDefault ? "Can't edit default prompt" : "Edit Prompt"}>
              <div>
                <IconButton disabled={prompt.isDefault} color="primary" onClick={handleEditOpen}>
                  <EditOutlined sx={{ fontSize: 20 }} />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Edit ">
              <IconButton color="error" aria-describedby={id} onClick={handleClick}>
                <DeleteOutline sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            {changingStatus && <CircularProgress size={20} />}
            <Tooltip
              arrow
              title={
                prompt.isActive
                  ? "Active Prompt: Active Prompts are shown in the comment options"
                  : "Inactive Prompt:Inactive prompts are hidden from the comment options."
              }
            >
              <Switch
                disabled={changingStatus}
                onClick={handlePromptStatus}
                checked={getPromptStatus()}
              />
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PromptCard;
