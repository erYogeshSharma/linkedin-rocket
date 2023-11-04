import React, { useState } from "react";
import { Backdrop, Box, Divider, Fade, IconButton, Modal, Stack, Typography } from "@mui/material";
import appStorage, { AppStorageType } from "../../../../../shared/storage/appStorage";
import CustomizedInputsStyled from "./CustomTextFeild";
import CustomizedSelects from "./CustomSelect";
import { CloseOutlined } from "@mui/icons-material";
import useStorage from "../../../../../shared/hooks/useStorage";
import { LoadingButton } from "@mui/lab";
import * as browser from "webextension-polyfill";
import MessageType from "../../../../../shared/constants/message-types";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};

const PromptForm = () => {
  const { promptForm }: AppStorageType = useStorage(appStorage);
  const [saving, setSaving] = useState(false);

  function handleClose() {
    appStorage.closePromptForm();
  }

  function handleChange(e: any) {
    appStorage.updatePromptForm({ ...promptForm.prompt, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setSaving(true);
    let message;
    if (promptForm.isEdit) {
      message = await browser.runtime.sendMessage({
        action: MessageType.UPDATE_PROMPT,
        prompt: {
          _id: promptForm.prompt._id,
          label: promptForm.prompt.label,
          prompt: promptForm.prompt.prompt,
          wordLimit: promptForm.prompt.wordLimit,
        },
      });
      if (message.message === "success") {
        appStorage.updatePrompt(message.data);
      }
    } else {
      message = await browser.runtime.sendMessage({
        action: MessageType.SAVE_PROMPT,
        prompt: {
          label: promptForm.prompt.label,
          prompt: promptForm.prompt.prompt,
          wordLimit: promptForm.prompt.wordLimit,
        },
      });
      if (message.message === "success") {
        appStorage.addPrompt(message.data);
      }
    }
    setSaving(false);
    handleClose();
  }
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={promptForm.open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={promptForm.open}>
        <Stack sx={style} direction="column" justifyContent="flex-start">
          <Box>
            <Stack p={1} direction="row" alignItems="center" justifyContent="space-between">
              <Typography fontSize={20} fontWeight={600}>
                {promptForm.isEdit ? "Edit Prompt" : "Add Prompt"}
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseOutlined />
              </IconButton>
            </Stack>
            <Divider />
            <Stack width="100%" p={1}>
              <Stack direction="row" alignItems="baseline" spacing={2}>
                <CustomizedInputsStyled
                  fullWidth
                  label="Label"
                  name="label"
                  onChange={handleChange}
                  value={promptForm.prompt.label}
                />
                <CustomizedSelects
                  label="Word Limit"
                  value={promptForm.prompt.wordLimit}
                  name="wordLimit"
                  onChange={handleChange}
                />
              </Stack>
              <CustomizedInputsStyled
                fullWidth
                label="prompt"
                multiline
                minRows={3}
                maxRows={5}
                name="prompt"
                onChange={handleChange}
                value={promptForm.prompt.prompt}
              />
            </Stack>
            <Divider />
            <Stack alignItems="flex-end" p={1}>
              <LoadingButton loading={saving} onClick={handleSave} variant="contained">
                {promptForm.isEdit ? "Update" : "Save"}
              </LoadingButton>
            </Stack>
          </Box>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default PromptForm;
