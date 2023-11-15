"use client";

import ListComponent from "@/components/ListComponent";
import { Box } from "@mui/material";
import LoginComponent from "@/components/LoginComponent";
import DepositComponent from "@/components/DepositComponent";
import CreateProductComponent from "@/components/CreateProductComponent";
import CreateUserComponent from "@/components/CreateUserComponent";

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", margin: "20px" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", marginRight: "20px" }}
      >
        <LoginComponent />
        <DepositComponent />
        <CreateProductComponent />
        <CreateUserComponent />
      </Box>
      <ListComponent />
    </Box>
  );
}
