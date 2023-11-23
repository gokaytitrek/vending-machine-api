"use client";

import ListComponent from "@/components/ListComponent";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import DepositComponent from "@/components/DepositComponent";
import CreateProductComponent from "@/components/CreateProductComponent";
import CreateUserComponent from "@/components/CreateUserComponent";
import LoginComponent from "@/components/LoginComponent";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Role } from "@/types";

export default function Home() {
  const { isLoggedIn, signOut } = useAuth();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const handler = () => {
      setHash((prev) => {
        const newHash = window.location.hash;
        if (prev !== newHash) {
          return newHash;
        }
        return prev;
      });
    };
    window.addEventListener("hashchange", handler);
    return () => {
      window.removeEventListener("hashchange", handler);
    };
  }, []);

  if (!isLoggedIn) {
    return hash === "#signUp" ? <CreateUserComponent /> : <LoginComponent />;
  }

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Vending machine
          </Typography>

          <nav>
            <Typography
              variant="subtitle1"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {Cookies.get("userName")}
            </Typography>
          </nav>
          <Button onClick={signOut} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexDirection: "row", margin: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {Cookies.get("role") === Role.Buyer && <DepositComponent />}
          {Cookies.get("role") === Role.Seller && <CreateProductComponent />}
        </Box>
        <ListComponent />
      </Box>
    </>
  );
}
