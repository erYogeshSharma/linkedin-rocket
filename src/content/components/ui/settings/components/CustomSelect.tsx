import * as React from "react";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectProps } from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";

/*
Tasks for tommorow

1. Default prompts
2. Enable disable prompts
 \*/

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(4),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 18,
    padding: "8px 26px 0px 12px",

    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

export default function CustomizedSelects(props: SelectProps) {
  return (
    <FormControl sx={{ minWidth: 200 }} variant="standard">
      <InputLabel sx={{ fontSize: 18 }} id="demo-customized-select-label">
        {props.label}
      </InputLabel>
      <Select
        {...props}
        labelId="demo-customized-select-label"
        id="demo-customized-select"
        size="small"
        input={<BootstrapInput />}
      >
        <MenuItem value={20}> {"> 20 Words "} </MenuItem>
        <MenuItem value={40}> {"> 40 Words"} </MenuItem>
        <MenuItem value={60}>{"> 60 Words "}</MenuItem>
      </Select>
    </FormControl>
  );
}
