import { Rocket } from "@mui/icons-material";
import { IconButton, Box, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";

import LinkedInClasses from "../../../shared/constants/linkedin-classes";

import useStorage from "../../../shared/hooks/useStorage";
import exampleThemeStorage from "../../../shared/storage/exampleThemeStorage";
import CommentPopover from "./components/CommentPopover";

export type ModalProps = {
  anchorEl: HTMLElement | null;
  parentForm: HTMLElement | null;
  post: HTMLElement | null;
};
const CommentButton = () => {
  const theme = useStorage(exampleThemeStorage);
  const [modalProps, setModalProps] = useState<ModalProps>({
    anchorEl: null,
    parentForm: null,
    post: null,
  });
  function toggleOpen(e: React.MouseEvent<HTMLElement>) {
    setModalProps((prevModalProps) => ({
      parentForm: e.currentTarget.closest("." + LinkedInClasses.COMMENT_BOX) as HTMLElement,
      post: e.currentTarget.closest("." + LinkedInClasses.POST_PARENT) as HTMLElement,
      anchorEl: prevModalProps.anchorEl ? null : e.currentTarget,
    }));
  }
  return (
    <Box>
      <Typography fontSize={20} onClick={exampleThemeStorage.toggle}>
        Toggle theme: {theme as string}
      </Typography>
      <CommentPopover settings={modalProps} setSettings={setModalProps} />
      <Tooltip arrow title="Comment with comment rocket" sx={{ fontSize: 40 }}>
        <IconButton onClick={toggleOpen}>
          <Rocket color="primary" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CommentButton;
