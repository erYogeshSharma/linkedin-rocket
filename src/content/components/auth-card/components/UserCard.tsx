import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import browser from "webextension-polyfill";
import { Refresh } from "@mui/icons-material";
import Icon from "./Icon";
import useStorage from "../../../../shared/hooks/useStorage";
import appStore, { AppStoreType } from "../../../../shared/storage/appStorage";
import MessageType from "../../../../shared/constants/message-types";
const UserCard = () => {
  const user: AppStoreType = useStorage(appStore);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleCreditRefresh() {
    setIsRefreshing(true);
    const data = await browser.runtime.sendMessage({
      action: MessageType.RELOAD_CREDITS_LIMIT,
    });
    if (data.message === "success") {
      appStore.updatePlan(data.data);
    }
    setIsRefreshing(false);
  }

  return (
    <Stack>
      <Stack alignItems="center">
        {/* <img src={logo} /> */}
        <Stack mb={1} direction="row" alignItems="center" spacing={0.5}>
          <Icon size={30} />
          <Typography fontSize={20} fontWeight={600} color="text.primary">
            ReplyRocket
          </Typography>
        </Stack>
      </Stack>
      <Stack width="100%">
        <Divider />
      </Stack>
      <Stack mt={1} spacing={2}>
        <Stack width="100%" alignItems="center">
          <Typography fontSize={18} fontWeight={500} color="text.primary">
            Hi, {user.user.firstName}
          </Typography>
        </Stack>
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={13} color="text.secondary" fontWeight={600}>
              Current Plan
            </Typography>
            <Typography fontSize={13} color="primary" fontWeight={600}>
              {user.plan.plan}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={13} color="text.secondary" fontWeight={600}>
              Comments Used
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography fontSize={13} color="primary" fontWeight={600}>
                {user.plan.creditsUsed}/{user.plan.totalCredits}
              </Typography>
              <Tooltip title="Refresh" arrow>
                {isRefreshing ? (
                  <CircularProgress size={12} />
                ) : (
                  <IconButton onClick={handleCreditRefresh} sx={{ p: 0 }}>
                    <Refresh />
                  </IconButton>
                )}
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack mt={2} spacing={1}>
        <Button
          sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }}
          size="small"
          variant="contained"
        >
          Upgrade Plan
        </Button>
        <Button
          onClick={() => appStore.logOut()}
          sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }}
          size="small"
          variant="contained"
        >
          LogOut
        </Button>
      </Stack>
    </Stack>
  );
};

export default UserCard;
