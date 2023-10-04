import { CloseOutlined, LinkedIn, Rocket } from "@mui/icons-material";
import {
  IconButton,
  Popover,
  Box,
  Stack,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
  styled,
  TooltipProps,
  tooltipClasses,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import theme from "../../../shared/utils/theme";
import MessageType from "../../../shared/constants/message-types";
import LinkedInClasses from "../../../shared/constants/linkedin-classes";
import emulateWriting from "../../dom-modifiers/comment";
import extensionStorage from "../../../shared/storage/storage";
import STORAGE_KEYS from "../../../shared/constants/storage-keys";
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
let loader: string = "";

chrome.runtime.onMessage.addListener(function (request) {
  switch (request.type) {
    case "generate-comment-response":
      if (loader) {
        emulateWriting(parentForm, request.comment);
      }
      loader = "";
      break;

    default:
      console.log("unknown request type", request.type);
  }
});
const CommentOption = (props: PopoverProps) => {
  const { anchorEl, setAnchorEl } = props;
  const open = Boolean(anchorEl);
  const [isUser, setIsUser] = useState(false);
  function handlePopoverClose() {
    setAnchorEl(null);
  }

  async function checkUser() {
    const token = await extensionStorage.get(STORAGE_KEYS.TOKEN);
    console.log(token);
    if (token) {
      setIsUser(true);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  async function generateComment(value: string) {
    loader = value;
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

  console.log(isUser);

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
      <Box onMouseLeave={handlePopoverClose} sx={{ width: 250 }}>
        <Stack alignItems="flex-end">
          <IconButton onClick={handlePopoverClose}>
            <CloseOutlined />{" "}
          </IconButton>
        </Stack>

        <List>
          {buttonTypes.map((button) => (
            <ListItem disablePadding>
              <ListItemButton
                disabled={loader.length > 0 || !isUser}
                onClick={() => generateComment(button.value)}
              >
                {loader === button.value && (
                  <ListItemIcon>
                    <CircularProgress />
                  </ListItemIcon>
                )}
                <ListItemText primary={button.label} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding>
            <ListItemButton disabled={loader.length > 0} onClick={handleAuth}>
              <ListItemIcon>
                <LinkedIn />
              </ListItemIcon>
              <ListItemText primary={isUser ? "SignOut" : "Signin to start"} />
            </ListItemButton>
          </ListItem>
        </List>
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

const Button = () => {
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

export default Button;
