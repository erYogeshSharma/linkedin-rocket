import React, { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import browser from "webextension-polyfill";
import { Refresh, Warning } from "@mui/icons-material";
import Icon from "./Icon";
import useStorage from "../../../../shared/hooks/useStorage";
import authStore, { AuthStorageType } from "../../../../shared/storage/authStorage";
import MessageType from "../../../../shared/constants/message-types";
import appStorage from "../../../../shared/storage/appStorage";
const UserCard = () => {
  const user: AuthStorageType = useStorage(authStore);
  const isActivePaidPlan = user.plan.isActive && user.plan.plan !== "Free";
  const isLimitOver = user.plan.creditsUsed >= user.plan.totalCredits;

  async function handleCreditRefresh() {
    authStore.setIsPlanRefreshing(true);
    const data = await browser.runtime.sendMessage({
      action: MessageType.RELOAD_CREDITS_LIMIT,
    });
    if (data.message === "success") {
      authStore.updatePlan(data.data);
    }
    authStore.setIsPlanRefreshing(false);
  }

  async function confirm_payment(subscriptionId: string, url: URL) {
    authStore.setIsPlanRefreshing(true);
    const message = await browser.runtime.sendMessage({
      action: MessageType.CONFIRM_PAYMENT,
      subscriptionId: subscriptionId,
    });
    if (message.message === "success") {
      authStore.updatePlan(message.data);
    }
    authStore.setIsPlanRefreshing(false);
    url.searchParams.delete("subscription_status");
    url.searchParams.delete("subscription_id");
    url.searchParams.delete("ba_token");
    url.searchParams.delete("token");
    const newUrl = url.toString();
    history.replaceState({}, document.title, newUrl);
  }
  useEffect(() => {
    const url = new URL(window.location.href);
    const subscription_status = url.searchParams.get("subscription_status");
    if (subscription_status) {
      if (subscription_status === "success") {
        const subscriptionId = url.searchParams.get("subscription_id") as string;
        confirm_payment(subscriptionId, url);
      }
      url.searchParams.delete("code");
      const newUrl = url.toString();
      history.replaceState({}, document.title, newUrl);
    }
  }, [window.location]);

  return (
    <Stack>
      <Stack alignItems="center">
        {/* <img src={} /> */}
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
                {user.isPlanRefreshing ? (
                  <CircularProgress size={12} />
                ) : (
                  <IconButton onClick={handleCreditRefresh} sx={{ p: 0 }}>
                    <Refresh />
                  </IconButton>
                )}
              </Tooltip>
            </Stack>
          </Stack>
          {isLimitOver && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Warning sx={{ fontSize: 15 }} color="error" />
              <Typography color="error" fontSize={13} fontWeight={600}>
                Credits Limit Expired
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Stack mt={2} spacing={1}>
        {!isActivePaidPlan && (
          <Button
            onClick={() => appStorage.openSettings("plan")}
            sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }}
            size="small"
            variant="contained"
          >
            Upgrade Plan
          </Button>
        )}
        <Button
          onClick={() => appStorage.openSettings("prompts")}
          sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }}
          size="small"
          variant="contained"
        >
          Customize you prompts
        </Button>
        <Button
          onClick={() => authStore.logOut()}
          sx={{ fontSize: 13, textTransform: "none", fontWeight: 600 }}
          size="small"
          variant="contained"
        >
          LogOut
        </Button>
        <Stack alignItems="center">
          <Link
            fontSize={13}
            component="button"
            fontWeight={500}
            onClick={() => appStorage.openSettings("feedback")}
          >
            Write Feedback
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UserCard;
