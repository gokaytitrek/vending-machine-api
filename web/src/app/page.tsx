"use client";

import ListComponent from "@/components/ListComponent";
import { Box, Button } from "@mui/material";
import DepositComponent from "@/components/DepositComponent";
import CreateProductComponent from "@/components/CreateProductComponent";
import CreateUserComponent from "@/components/CreateUserComponent";
import LoginComponent from "@/components/LoginComponent";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import ContainerComponent from "@/components/ContainerComponent";

export default function Home() {
  const { isLoggedIn, signOut } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ContainerComponent
          buttonText={"Sign in"}
          handleClick={() => setIsLogin(true)}
          secondaryButton="Create Account"
          handleSecondary={() => setIsLogin(false)}
        >
          {isLogin ? <LoginComponent /> : <CreateUserComponent />}
        </ContainerComponent>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", margin: "20px" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", marginRight: "20px" }}
      >
        <Button onClick={signOut}>{'Sign out'}</Button>
        <DepositComponent />
        <CreateProductComponent />
      </Box>
      <ListComponent />
    </Box>
  );
}
