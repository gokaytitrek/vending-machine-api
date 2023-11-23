import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAuth } from "@/providers/AuthProvider";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";
import { Role } from "@/types";
import SnackbarComponent from "./SnackBarComponent";

export default function CreateProductComponent() {
  const { signUp } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userName = data.get("userName")?.toString();
    const password = data.get("password")?.toString();
    const role = data.get("role")?.toString();

    if (userName && password && role) {
      const error = await signUp(userName, password, role as Role);

      if (error) {
        setError(error);
      }
    }
    event.target.reset();
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Create account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Username"
              name="userName"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="BUYER"
              name="role"
            >
              <FormControlLabel
                value={Role.Buyer}
                control={<Radio />}
                label="Buyer"
              />
              <FormControlLabel
                value={Role.Seller}
                control={<Radio />}
                label="Seller"
              />
            </RadioGroup>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>

            <Grid container>
              <Grid item>
                <Link href="#signIn" variant="body2">
                  {"Do you have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <SnackbarComponent error={error} />
    </>
  );
}
