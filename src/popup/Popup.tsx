import { Box, Button, Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import STORAGE_KEYS from "../shared/constants/storage-keys";
import { Comment, LinkedIn, Settings } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../shared/utils/theme";
import extensionStorage from "../shared/storage/storage";
import { User } from "../shared/types/user";
import logo from "../assets/logo.svg";
import UserUI from "./components/UserUI";
import GuestUI from "./components/GuestUI";
import Footer from "./components/Footer";
async function getUser() {
  const user = await extensionStorage.get(STORAGE_KEYS.USER);
  return user;
}
const Popup = () => {
  const [user, setUser] = useState<User>({} as User);
  async function getUser() {
    const user = await extensionStorage.get(STORAGE_KEYS.USER);
    console.log(user);
    return user;
  }

  useEffect(() => {
    getUser();
  }, []);

  const hex = "#0072b1";

  return (
    <ThemeProvider theme={theme}>
      <Paper>
        <Stack justifyContent="space-between" sx={{ width: "230px", height: "300px" }}>
          <Stack>
            <Stack p={1} spacing={1} height="40px" direction="row" alignItems="center">
              <img style={{ maxHeight: "100%", maxWidth: "100%" }} src={logo} alt="logo" />
              <Typography fontWeight={600} color={hex} fontSize={16}>
                Comments Rocket
              </Typography>
            </Stack>
            <Divider />
          </Stack>
          <Stack p={1}>{!user?.lastName ? <GuestUI /> : <UserUI user={user} />}</Stack>
          {user?.lastName ? <Footer /> : <Stack p={1}></Stack>}
        </Stack>
      </Paper>
    </ThemeProvider>
  );
};

export default Popup;
