import {
  AutoFixHigh,
  CloseOutlined,
  LogoutOutlined,
  Rocket,
  Settings,
  Tune,
} from "@mui/icons-material";
import {
  IconButton,
  Popover,
  Box,
  Stack,
  Tooltip,
  styled,
  TooltipProps,
  tooltipClasses,
  Typography,
  Divider,
  LinearProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import theme from "../../../shared/utils/theme";
import MessageType from "../../../shared/constants/message-types";
import LinkedInClasses from "../../../shared/constants/linkedin-classes";
// import emulateWriting from "../../dom-modifiers/comment";
import extensionStorage from "../../../shared/storage/storage";
import STORAGE_KEYS from "../../../shared/constants/storage-keys";
import SettingsModal from "../ui/settings/Settings";
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

let post: HTMLElement;
let parentForm: HTMLElement;
type PopoverProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
};

function initListener(loader: string, setLoader: any, setIsExpired: any) {
  chrome.runtime.onMessage.addListener(function (request) {
    switch (request.type) {
      case "generate-comment-response":
        // emulateWriting(parentForm, request.comment);

        setLoader("");
        break;
      case "generate-comment-response-expired":
        setLoader("");
        setIsExpired(true);

        console.log("expired");
        break;

      default:
        console.log("unknown request type", request.type);
    }
  });
}
const CommentOption = (props: PopoverProps) => {
  const { anchorEl, setAnchorEl } = props;
  const open = Boolean(anchorEl);
  const [isLimitOver, setIsLimitOver] = useState(false);
  const [loader, setLoader] = useState("");
  const [isUser, setIsUser] = useState(false);
  function handlePopoverClose() {
    setAnchorEl(null);
  }

  const [settingsModalProps, setSettingsModalProps] = useState({
    tab: "prompt",
    open: false,
  });

  async function checkUser() {
    const token = await extensionStorage.get(STORAGE_KEYS.TOKEN);
    if (token) {
      setIsUser(true);
    }
  }

  useEffect(() => {
    checkUser();
    initListener(loader, setLoader, setIsLimitOver);
  }, []);

  function openSettings(tab: string) {
    setSettingsModalProps((t: any) => ({ tab: tab, open: true }));
  }

  async function generateComment(value: string) {
    const element = post.querySelector("." + LinkedInClasses.POST_DESCRIPTION) as HTMLInputElement;
    let text = element?.innerText;
    const textWithoutSeeMore = text.replace(/…see more/g, "");
    chrome.runtime.sendMessage({
      type: MessageType.GET_COMMENT,
      buttonType: value,
      description: textWithoutSeeMore,
      parentForm: parentForm,
      jack: "joh",
    });
  }

  async function handleAuth() {
    if (!isUser) {
      chrome.runtime.sendMessage({ type: MessageType.START_AUTH });
    } else {
      await extensionStorage.clear();
      window.location.reload();
    }
  }

  return (
    <Popover
      id="mouse-over-popover"
      open={open}
      anchorEl={anchorEl}
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
              {loader === button.value && <LinearProgress />}
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
          <Tooltip title="Logout" arrow>
            <IconButton onClick={handleAuth}>
              <LogoutOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Popover>
  );
};

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 14,
    fontWeight: "normal",
  },
}));

const CommentButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  function toggleOpen(e: React.MouseEvent<HTMLElement>) {
    parentForm = e.currentTarget.closest("." + LinkedInClasses.COMMENT_BOX) as HTMLElement;
    post = e.currentTarget.closest("." + LinkedInClasses.POST_PARENT) as HTMLElement;
    setAnchorEl((a) => (a ? null : e.currentTarget));
  }
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <CommentOption anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        <LightTooltip arrow title="Comment with comment rocket" sx={{ fontSize: 40 }}>
          <IconButton onClick={toggleOpen}>
            <Rocket color="primary" />
          </IconButton>
        </LightTooltip>
      </Box>
    </ThemeProvider>
  );
};

export default CommentButton;
