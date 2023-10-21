import { CloseOutlined, Settings, SubscriptRounded, Tune } from "@mui/icons-material";
import { Backdrop, Box, Divider, Fade, IconButton, Modal, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import Prompts from "./childrens/Prompts";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};
type ModalProps = {
  settings: {
    tab: string;
    open: boolean;
  };
  setSettings: React.Dispatch<
    React.SetStateAction<{
      tab: string;
      open: boolean;
    }>
  >;
};

const TAB_OPTIONS = [
  {
    label: "Prompts",
    value: "prompts",
    icon: Tune,
  },
  {
    label: "Settings",
    value: "settings",
    icon: Settings,
  },
  {
    label: "Plan",
    value: "plan",
    icon: SubscriptRounded,
  },
];
const SettingsModal = (props: ModalProps) => {
  const { settings, setSettings } = props;
  const [currentTab, setCurrentTab] = useState("prompts");

  function handleClose() {
    setSettings((s) => ({ tab: "prompts", open: false }));
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={settings.open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={settings.open}>
        <Stack sx={style} direction="column" justifyContent="space-between">
          <Stack>
            <Stack p={1} direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Comments Rocket
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseOutlined />
              </IconButton>
            </Stack>
            <Divider />
          </Stack>
          <Stack direction="row" height={500} divider={<Divider orientation="vertical" flexItem />}>
            <Stack width={130}>
              <Stack divider={<Divider />}>
                {TAB_OPTIONS.map((Tab) => (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    key={Tab.label}
                    onClick={() => setCurrentTab(Tab.value)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: Tab.value === currentTab ? "#7875fc" : "#fff",
                      ":hover": {
                        backgroundColor: Tab.value === currentTab ? "#7875fc" : "#d3deff",
                      },
                    }}
                    p={1}
                  >
                    <Tab.icon
                      sx={(theme) => ({
                        color: Tab.value === currentTab ? "#fff" : theme.palette.text.primary,
                      })}
                    />
                    <Typography
                      fontWeight={500}
                      variant="body1"
                      color={Tab.value === currentTab ? "white" : "text.primary"}
                    >
                      {Tab.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider />
            </Stack>
            <Stack flexGrow={1}>
              <Prompts />
            </Stack>
          </Stack>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default SettingsModal;
