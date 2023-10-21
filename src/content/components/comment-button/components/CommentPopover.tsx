import { AutoFixHigh, CloseOutlined, Settings, Tune } from "@mui/icons-material";
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

import SettingsModal from "../../ui/settings/Settings";
import { ModalProps } from "../CommentButton";

const buttonTypes = [
  {
    label: "👏 Supportive",
    value: "Supportive",
  },
  {
    label: "❓ Inquisitive",
    value: "Inquisitive",
  },
  {
    label: "🙌 Appreciative",
    value: "Appreciative",
  },
];

type PopoverProps = {
  settings: ModalProps;
  setSettings: React.Dispatch<React.SetStateAction<ModalProps>>;
};

const CommentPopover = (props: PopoverProps) => {
  const { settings, setSettings } = props;
  const open = Boolean(settings.anchorEl);
  const [isLimitOver, setIsLimitOver] = useState(false);
  const [generatingCommentFor, setGeneratingCommentFor] = useState("");

  function handlePopoverClose() {
    setSettings((prevSettings) => ({ ...prevSettings, anchorEl: null }));
  }

  const [settingsModalProps, setSettingsModalProps] = useState({
    tab: "prompt",
    open: false,
  });

  function openSettings(tab: string) {
    setSettingsModalProps((t: any) => ({ tab: tab, open: true }));
  }

  async function generateComment(value: string) {
    setGeneratingCommentFor(value);
    const element = settings?.post?.querySelector(
      "." + LinkedInClasses.POST_DESCRIPTION
    ) as HTMLInputElement;
    let text = element?.innerText;
    const textWithoutSeeMore = text.replace(/…see more/g, "");
    const response = await browser.runtime.sendMessage({
      action: MessageType.GET_COMMENT,
      commentType: value,
      description: textWithoutSeeMore,
    });
    if (response.message === "success") {
    }
  }

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
        <SettingsModal settings={settingsModalProps} setSettings={setSettingsModalProps} />
        <Stack alignItems="flex-end">
          <IconButton onClick={handlePopoverClose}>
            <CloseOutlined />{" "}
          </IconButton>
        </Stack>
        <Stack divider={<Divider />}>
          {buttonTypes.map((button) => (
            <Stack
              key={button.label}
              onClick={() => generateComment(button.value)}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#e6f3ff",
                },
              }}
            >
              <Stack p={1}>
                <Typography sx={{ fontSize: "20px" }}>{button.label}</Typography>
              </Stack>
              {generatingCommentFor === button.value && <LinearProgress />}
            </Stack>
          ))}
          {isLimitOver && <Typography>Expired</Typography>}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Make my comment better" arrow>
            <IconButton>
              <AutoFixHigh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings" arrow>
            <IconButton onClick={() => openSettings("settings")}>
              <Settings />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tune your comments AI" arrow>
            <IconButton onClick={() => openSettings("prompts")}>
              <Tune />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Popover>
  );
};

export default CommentPopover;
