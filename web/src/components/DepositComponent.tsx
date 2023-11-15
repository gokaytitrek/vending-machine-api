"use client";

import { TextField, Typography } from "@mui/material";
import { useState } from "react";
import ContainerComponent from "@/components/ContainerComponent";
import { post } from "@/utils/helper";

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

  return (
    <ContainerComponent buttonText="Add" handleClick={handleDeposit}>
      <TextField
        required
        label="Deposit"
        variant="standard"
        className="bg-gray-700"
        type="number"
        value={deposit.amount}
        onChange={(e) => setDeposit({ ...deposit, amount: e.target.value })}
      />
      {deposit.error && (
        <Typography variant="body2" color="error">
          {deposit.error}
        </Typography>
      )}
    </ContainerComponent>
  );
}
