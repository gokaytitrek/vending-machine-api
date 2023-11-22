"use client";

import { TextField, Typography } from "@mui/material";
import { useState } from "react";
import RadioComponent from "@/components/RadioComponent";
import ContainerComponent from "@/components/ContainerComponent";
import { Role } from "@/types";
import { useAuth } from "@/providers/AuthProvider";

const ROLE = [
  {
    value: Role.Buyer,
    label: "Buyer",
  },
  {
    value: Role.Seller,
    label: "Seller",
  },
];

const initialState = {
  name: "",
  password: "",
  role: Role.Buyer,
  error: "",
};

export default function CreateUserComponent() {
  const [user, setUser] = useState(initialState);
  const { signUp } = useAuth();

  const handleCreateUser = async () => {
    try {
      const error = await signUp(user.name, user.password, user.role);

      if (!error) {
        setUser(initialState);
      } else {
        setUser({ ...user, error });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ContainerComponent buttonText="Next" handleClick={handleCreateUser}>
      <TextField
        required
        label="User name"
        variant="standard"
        className="bg-gray-700"
        inputProps={{ maxLength: 20 }}
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <TextField
        required
        label="Password"
        variant="standard"
        type="password"
        inputProps={{ maxLength: 20 }}
        className="bg-gray-700"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <RadioComponent
        title=""
        value={user.role}
        options={ROLE}
        handleChange={(event) => {
          setUser({
            ...user,
            role: (event.target as HTMLInputElement).value as Role,
          });
        }}
      />
      {user.error && (
        <Typography variant="body2" color="error">
          {user.error}
        </Typography>
      )}
    </ContainerComponent>
  );
}
