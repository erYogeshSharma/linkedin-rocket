import { Paper, Stack } from "@mui/material";
import React from "react";
import UserCard from "./components/UserCard";
import GuestCard from "./components/GuestCard";
import useStorage from "../../../shared/hooks/useStorage";
import appStore, { AuthStorageType } from "../../../shared/storage/authStorage";
import SettingsModal from "../ui/settings/Settings";
const AccountCard = () => {
  const user: AuthStorageType = useStorage(appStore);
  const isUser = user?.user?._id.length > 0;

  return (
    <Stack mb={1}>
      <SettingsModal />
      <Paper sx={{ borderRadius: 2 }}>
        <Stack p={1}>{isUser ? <UserCard /> : <GuestCard />}</Stack>
      </Paper>
    </Stack>
  );
};

export default AccountCard;
