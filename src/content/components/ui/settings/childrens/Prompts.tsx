import { Select, Stack, TextField } from "@mui/material";
import React, { useState } from "react";

type Prompt = {
  label: string;
  prompt: string;
  lessThan: number;
};
const my_prompts: Prompt[] = [
  {
    label: "Aggressive",
    prompt: "this is the data and the data ",
    lessThan: 70,
  },
];
const length_option = [
  {
    label: "< 25 ",
    value: 25,
  },
  {
    label: "< 50",
    value: 50,
  },
  {
    label: "< 75 ",
    value: 75,
  },
  {
    label: "< 100 ",
    value: 100,
  },
];
const Prompts = () => {
  const [prompts, setPrompts] = useState(my_prompts);
  const [promptForm, setPromptForm] = useState<Prompt>({} as Prompt);

  function addPrompt(prompt: Prompt) {
    setPrompts((p) => p.concat(prompt));
  }

  return (
    <Stack>
      {prompts.map((prompt) => (
        <Stack direction="row" alignItems="center">
          <TextField size="small" label="Label" />
          <TextField size="small" multiline minRows={3} maxRows={10} />
        </Stack>
      ))}
    </Stack>
  );
};

export default Prompts;
