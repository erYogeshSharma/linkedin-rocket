import React, { useEffect, useState } from "react";
import { Container, Divider, Grid, Paper, Skeleton, Stack, Typography } from "@mui/material";
import MessageType from "../../../../../shared/constants/message-types";
import browser from "webextension-polyfill";
import { LoadingButton } from "@mui/lab";
type Plan = {
  id: string;
  name: string;
  description: string;
  pricing: {
    currency_code: string;
    value: string;
  };
  frequency: {
    interval_unit: string;
    interval_count: string;
  };
};
const PlansList = () => {
  const [loading, setLoading] = useState(true);
  const [subscribingTo, setSubscribingTo] = useState("");
  const [plans, setPlans] = useState<Plan[]>({} as Plan[]);
  async function getPlans() {
    setLoading(true);
    const message = await browser.runtime.sendMessage({
      action: MessageType.GET_PLANS,
    });

    if (message.message === "success") {
      setPlans(message.data);
    }
    setLoading(false);
  }

  async function subscribe_now(planId: string) {
    setSubscribingTo(planId);
    const message = await browser.runtime.sendMessage({
      action: MessageType.GET_SUBSCRIPTION_URL,
      planId: planId,
    });

    if (message.message === "success") {
      window.location.href = message.data.link;
      setSubscribingTo("");
    }
  }
  useEffect(() => {
    if (!plans.length) {
      getPlans();
    }
  }, []);
  return (
    <Container maxWidth="sm">
      <Grid container direction="row" spacing={2}>
        {loading &&
          [0, 1].map((i) => (
            <Grid mt={2} item xs={6} key={i}>
              <Skeleton sx={{ borderRadius: 2 }} height={200} variant="rectangular" />
            </Grid>
          ))}
        {!loading &&
          plans?.length &&
          plans.map((plan) => (
            <Grid item xs={6} key={plan.id}>
              <Paper>
                <Stack mt={2} p={1} sx={{ textAlign: "center" }} spacing={1}>
                  <Stack height={50} alignItems="center" justifyContent="center">
                    <Typography fontWeight={600} fontSize={20}>
                      {plan.name}
                    </Typography>
                  </Stack>
                  <Divider sx={{ borderBottom: "2px solid #c4c1c1" }} />
                  <Stack spacing={1} alignItems="center">
                    <Typography fontSize={12} color="text.secondary">
                      {plan.description}{" "}
                    </Typography>

                    <Typography fontSize={30} fontWeight={400} color="primary">
                      $ {Number(plan.pricing.value).toFixed(0)}/{plan.frequency.interval_unit}
                    </Typography>
                    <LoadingButton
                      loading={subscribingTo === plan.id}
                      disabled={subscribingTo.length > 0}
                      size="large"
                      variant="contained"
                      onClick={() => subscribe_now(plan.id)}
                    >
                      Subscribe Now
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default PlansList;
