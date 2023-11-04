import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import authStorage, { AuthStorageType } from "../../../../../shared/storage/authStorage";
import useStorage from "../../../../../shared/hooks/useStorage";
import PlansList from "./PlansList";
import CurrentPlanCard from "./CurrentPlanCard";

const Plan = () => {
  const user: AuthStorageType = useStorage(authStorage);
  const isActivePaidPlan = user.plan.isActive && user.plan.plan !== "Free";
  return (
    <Box>
      <Stack mb={2}>
        <Stack mb={2}>
          <Typography fontSize={20} fontWeight={600}>
            Subscription Plans
          </Typography>
          <Divider />
        </Stack>
        <CurrentPlanCard />
        {!isActivePaidPlan && <PlansList />}
      </Stack>
    </Box>
  );
};

export default Plan;
