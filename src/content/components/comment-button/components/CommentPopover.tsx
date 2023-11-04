import { CloseOutlined } from "@mui/icons-material";
import {
  IconButton,
  Popover,
  Box,
  Stack,
  Tooltip,
  Typography,
  Divider,
  LinearProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as browser from "webextension-polyfill";
import MessageType from "../../../../shared/constants/message-types";
import LinkedInClasses from "../../../../shared/constants/linkedin-classes";
// import emulateWriting from "../../dom-modifiers/comment";
import appStorage, { AppStorageType } from "../../../../shared/storage/appStorage";
import { ModalProps } from "../CommentButton";
import useStorage from "../../../../shared/hooks/useStorage";
import appStore, { AuthStorageType } from "../../../../shared/storage/authStorage";
import Icon from "../../auth-card/components/Icon";
import { Settings } from "@mui/icons-material";

type PopoverProps = {
  settings: ModalProps;
  setSettings: React.Dispatch<React.SetStateAction<ModalProps>>;
};

const CommentPopover = (props: PopoverProps) => {
  const { prompts }: AppStorageType = useStorage(appStorage);
  const user: AuthStorageType = useStorage(appStore);
  const isLimitOver = user.plan.creditsUsed >= user.plan.totalCredits;
  const { settings, setSettings } = props;
  const open = Boolean(settings.anchorEl);
  const [generatingCommentFor, setGeneratingCommentFor] = useState("");
  const [fetching, setFetching] = useState(false);

  function handlePopoverClose() {
    setSettings((prevSettings) => ({ ...prevSettings, anchorEl: null }));
  }

  async function emulateWriting(text: string) {
    let input = settings?.parentForm?.querySelector(".ql-editor p") as HTMLInputElement;
    input.innerText = " ";
    let i = 0;
    let interval = setInterval(() => {
      if (i < text.length) {
        input.innerText += text[i];
        i++;
        for (let j = 0; j < 10; j++) {
          if (i < text.length) {
            input.innerText += text[i];
            i++;
          }
        }
      } else {
        clearInterval(interval);
        // we need to remove `ql-blank` style from the section by LinkedIn div processing logic
        input?.parentElement?.classList.remove("ql-blank");
      }
    }, 10);
  }

  async function generateComment(value: string) {
    if (isLimitOver) {
      appStorage.openSettings("plan");
      return;
    }
    if (generatingCommentFor.length) {
      return;
    }

    setGeneratingCommentFor(value);
    const element = settings?.post?.querySelector(
      "." + LinkedInClasses.POST_DESCRIPTION
    ) as HTMLInputElement;
    let text = element?.innerText;
    const textWithoutSeeMore = text.replace(/…see more/g, "");
    const response = await browser.runtime.sendMessage({
      action: MessageType.GET_COMMENT,
      prompt: value,
      postDescription: textWithoutSeeMore,
    });
    if (response.message === "success") {
      await emulateWriting(response.data);
      appStore.creditUsed();
      setGeneratingCommentFor("");
    }
  }

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
    if (prompts.length) {
      getPrompts();
    }
  }, []);

  return (
    <Popover
      id="mouse-over-popover"
      open={open}
      anchorEl={settings.anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      <Box sx={{ width: 250 }}>
        <Stack p={1} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon size={30} />
            <Typography fontWeight={600} fontSize={18}>
              ReplyRocket
            </Typography>
          </Stack>
          <IconButton onClick={handlePopoverClose}>
            <CloseOutlined sx={{ fontSize: 20 }} />{" "}
          </IconButton>
        </Stack>
        <Divider />
        {fetching && <LinearProgress />}
        <Stack divider={<Divider />} sx={{ maxHeight: 250, overflowY: "auto" }}>
          {prompts
            .filter((p) => p.isActive)
            .map((button) => (
              <Stack
                key={button.label}
                onClick={() => generateComment(button._id)}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#e6f3ff",
                  },
                }}
              >
                <Stack p={1}>
                  <Typography
                    fontSize={15}
                    color={generatingCommentFor ? "text.disabled" : "text.primary"}
                    fontWeight={500}
                  >
                    {button.label}
                  </Typography>
                </Stack>
                {generatingCommentFor === button._id && <LinearProgress />}
              </Stack>
            ))}
        </Stack>
        <Divider />
        <Stack direction="row" alignItems="center" spacing={1} p={1}>
          <Tooltip title="Settings" arrow>
            <IconButton onClick={() => appStorage.openSettings("prompts")}>
              <Settings sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Popover>
  );
};

export default CommentPopover;
