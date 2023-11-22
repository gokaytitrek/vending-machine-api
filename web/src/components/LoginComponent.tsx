import { TextField, Typography } from "@mui/material";
import ContainerComponent from "./ContainerComponent";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

const initialState = {
  name: "",
  password: "",
  error: "",
};

export default function LoginComponent() {
  const { signIn } = useAuth();
  const [user, setUser] = useState(initialState);

  const handleLogin = async () => {
    const error = await signIn(user.name, user.password);

    if (!error) {
      setUser(initialState);
    } else {
      setUser({ ...user, error });
    }
  };

  return (
    <ContainerComponent buttonText="Next" handleClick={handleLogin} >
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
      {user.error && (
        <Typography variant="body2" color="error">
          {user.error}
        </Typography>
      )}
    </ContainerComponent>
  );
}
