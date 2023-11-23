"use client";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { post } from "@/utils/helper";
import SnackbarComponent from "./SnackBarComponent";

const initialState = {
  amount: "",
  error: "",
};
export default function DepositComponent() {
  const [deposit, setDeposit] = useState(initialState);

  const handleDeposit = async () => {
    try {
      const { status, error } = await post("/deposit", {
        amount: Number(deposit.amount),
      });
      if (status === 201) {
        setDeposit(initialState);
      } else {
        setDeposit({ ...deposit, error });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    try {
      const { status, error } = await post("/user/reset", {});
      if (status === 201) {
        setDeposit(initialState);
      } else {
        setDeposit({ ...deposit, error });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Card
        sx={{
          border: 1,
          borderColor: (theme) => theme.palette.grey[200],
        }}
      >
        <CardContent>
          <TextField
            required
            label="Deposit"
            variant="standard"
            className="bg-gray-700"
            type="number"
            value={deposit.amount}
            onChange={(e) => setDeposit({ ...deposit, amount: e.target.value })}
          />
        </CardContent>
        <CardActions>
          <Button fullWidth variant={"contained"} onClick={handleDeposit}>
            {"Add"}
          </Button>
          <Button fullWidth variant={"outlined"} onClick={handleReset}>
            {"Reset"}
          </Button>
        </CardActions>
      </Card>
      <SnackbarComponent error={deposit.error} />
    </>
  );
}
