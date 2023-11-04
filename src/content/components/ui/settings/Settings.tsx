import { CloseOutlined, FeedbackOutlined, SubscriptRounded, Tune } from "@mui/icons-material";
import {
  Backdrop,
  Divider,
  Fade,
  IconButton,
  Modal,
  Stack,
  Theme,
  Typography,
} from "@mui/material";
import React from "react";
import useStorage from "../../../../shared/hooks/useStorage";
import appStorage, { AppStorageType, Tab } from "../../../../shared/storage/appStorage";
import Prompts from "./components/Prompts";
import Plan from "./components/Plan";
import Feedback from "./components/Feedback";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};

const TAB_OPTIONS: { label: string; value: Tab; icon: any }[] = [
  {
    label: "Prompts",
    value: "prompts",
    icon: Tune,
  },
  {
    label: "Feedback",
    value: "feedback",
    icon: FeedbackOutlined,
  },
  {
    label: "Plan",
    value: "plan",
    icon: SubscriptRounded,
  },
];
const SettingsModal = () => {
  const { settingsModalProps }: AppStorageType = useStorage(appStorage);

  function handleClose() {
    appStorage.closeSettings();
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={settingsModalProps.open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={settingsModalProps.open}>
        <Stack sx={style} direction="column" justifyContent="flex-start">
          <Stack>
            <Stack p={1} direction="row" alignItems="center" justifyContent="space-between">
              <Typography fontSize={18} fontWeight={600} color="text.primary">
                Reply Rocket
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseOutlined sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
            <Divider />
          </Stack>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            <Stack width={130} height={545}>
              <Stack divider={<Divider />}>
                {TAB_OPTIONS.map((Tab) => (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    key={Tab.label}
                    onClick={() => appStorage.openSettings(Tab.value)}
                    sx={(theme) => ({
                      cursor: "pointer",
                      backgroundColor:
                        Tab.value === settingsModalProps.tab ? theme.palette.primary.main : "#fff",
                      ":hover": {
                        backgroundColor:
                          Tab.value === settingsModalProps.tab
                            ? theme.palette.primary.main
                            : "#d3deff",
                      },
                    })}
                    p={1}
                  >
                    <Tab.icon
                      sx={(theme: Theme) => ({
                        fontSize: 20,
                        color:
                          Tab.value === settingsModalProps.tab
                            ? "#fff"
                            : theme.palette.text.primary,
                      })}
                    />
                    <Typography
                      fontWeight={600}
                      fontSize={16}
                      color={Tab.value === settingsModalProps.tab ? "white" : "text.primary"}
                    >
                      {Tab.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider />
            </Stack>
            <Stack height="100%" flexGrow={1} p={1} sx={{ background: "#f5f5f5" }}>
              {settingsModalProps.tab === "prompts" && <Prompts />}
              {settingsModalProps.tab === "plan" && <Plan />}
              {settingsModalProps.tab === "feedback" && <Feedback />}
            </Stack>
          </Stack>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default SettingsModal;
