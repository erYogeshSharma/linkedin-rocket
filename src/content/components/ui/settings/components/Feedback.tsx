import { Alert, Divider, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import CustomizedInputsStyled from "./CustomTextFeild";
import { LoadingButton } from "@mui/lab";
import * as browser from "webextension-polyfill";
import MessageType from "../../../../../shared/constants/message-types";
const Feedback = () => {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const message = await browser.runtime.sendMessage({
      action: MessageType.SEND_FEEDBACK,
      feedback: feedback,
    });

    if (message.message === "success") {
      setShowMessage(true);
    }
    setSubmitting(false);
    setFeedback("");
  }
  return (
    <Stack spacing={2}>
      <Stack>
        <Typography fontSize={18} fontWeight={600}>
          Feedback
        </Typography>
        <Divider />
      </Stack>
      <CustomizedInputsStyled
        fullWidth
        label="Write feedback"
        disabled={submitting}
        multiline
        minRows={4}
        maxRows={6}
        name="prompt"
        onChange={(e) => setFeedback(e.target.value)}
        value={feedback}
      />
      <Stack>
        {showMessage && (
          <Alert severity="success">
            <Typography fontSize={15} fontWeight={600} color="success">
              Feedback sent successfully!
            </Typography>
          </Alert>
        )}
      </Stack>
      <Stack alignItems="flex-end">
        <LoadingButton
          onClick={handleSubmit}
          loading={submitting}
          disabled={feedback.length < 1}
          variant="contained"
        >
          Send
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default Feedback;
