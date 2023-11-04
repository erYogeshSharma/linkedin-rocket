import React from "react";
import authStorage, { AuthStorageType } from "../../../../../shared/storage/authStorage";
import useStorage from "../../../../../shared/hooks/useStorage";
import { CircularProgress, Grid, Paper } from "@mui/material";
import { Divider, Stack, Typography } from "@mui/material";
import { Circle } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

function formatDateString(inputDate: string): string {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
}
const CurrentPlanCard = () => {
  const { plan, isPlanRefreshing }: AuthStorageType = useStorage(authStorage);

  return (
    <Grid>
      <Paper variant="outlined">
        {isPlanRefreshing ? (
          <Stack height={200} alignItems="center" justifyContent="center">
            <CircularProgress size={100} sx={{ opacity: "50%" }} />{" "}
          </Stack>
        ) : (
          <Stack p={1} spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography fontSize={14} fontWeight={600}>
                Current Plan
              </Typography>
              <Circle color="success" />
            </Stack>
            <Divider />
            <Stack>
              <Typography color="primary" fontWeight={600} fontSize={16}>
                {plan.plan}
              </Typography>
              <Typography fontWeight={600} fontSize={12}>
                Started on: {formatDateString(plan.createdAt)}
              </Typography>
              {plan.plan === "Free" ? (
                <Typography fontWeight={600} fontSize={12}>
                  Ends on: {formatDateString(plan.expiresOn)}
                </Typography>
              ) : (
                <Typography fontWeight={600} fontSize={12}>
                  Renews on: {formatDateString(plan.renewsOn)}
                </Typography>
              )}
              <Typography fontWeight={600} fontSize={12}>
                Credits used: {plan.creditsUsed} / {plan.totalCredits}
              </Typography>
            </Stack>
            <Stack alignItems="center" justifyContent="center"></Stack>
            <Stack spacing={1} alignItems="center">
              <Typography fontSize={12} color="text.secondary">
                {plan.isActive}{" "}
              </Typography>
            </Stack>
            {plan.plan !== "Free" && (
              <Stack alignItems="flex-end">
                <LoadingButton variant="contained" size="small">
                  <Typography fontSize={15} color="#fff" fontWeight={600}>
                    Cancel Subscription
                  </Typography>
                </LoadingButton>
              </Stack>
            )}
          </Stack>
        )}
      </Paper>
    </Grid>
  );
};

export default CurrentPlanCard;
