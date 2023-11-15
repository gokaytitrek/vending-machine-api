import { TextField, Typography } from "@mui/material";
import ContainerComponent from "./ContainerComponent";
import { useEffect, useState } from "react";
import { post } from "@/utils/helper";
import Cookies from "js-cookie";

const initialState = {
  name: "",
  password: "",
  error: "",
};

export default function LoginComponent() {
  const [user, setUser] = useState(initialState);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    const { status, error, data } = await post("/user/login", {
      userName: user.name,
      password: user.password,
    });

    if (status === 201) {
      Cookies.set("token", data.accessToken);

      setUser(initialState);

      setLoggedIn(true);
    } else {
      setUser({ ...user, error });
    }
  };

  if (loggedIn) {
    return (
      <ContainerComponent
        buttonText="Logout"
        handleClick={() => {
          setLoggedIn(false);
          Cookies.remove("token");
        }}
      />
    );
  }
  return (
    <ContainerComponent buttonText="Login" handleClick={handleLogin}>
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
