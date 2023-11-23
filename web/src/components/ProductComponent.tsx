"use client";

import { useProductData } from "@/providers/DataProvider";
import { Product } from "@/types";
import { deleteProduct, post } from "@/utils/helper";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Grid,
  CardHeader,
} from "@mui/material";
import { useState } from "react";
import SnackbarComponent from "./SnackBarComponent";

export default function ProductComponent({ product }: { product: Product }) {
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState("");

  const { refreshData } = useProductData();

  const handleChange = (s: string) => {
    switch (s) {
      case "increase":
        setAmount((prev) => prev + 1);
        break;
      case "decrease":
        setAmount((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            return prev;
          }
        });
        break;
    }
  };

  const handleBuy = async () => {
    const { status, error } = await post("/buy", {
      productId: product._id,
      amount,
    });

    setError(error);
    if (!error) {
      refreshData();
    }
  };

  const handleDelete = async () => {
    const { status, error } = await deleteProduct({ productId: product._id });
    setError(error);
    if (!error) {
      refreshData();
    }
  };

  return (
    <Grid item key={product._id} xs={12} sm={6} md={4}>
      <Card>
        <CardHeader
          title={product.productName}
          titleTypographyProps={{ align: "center" }}
          subheaderTypographyProps={{
            align: "center",
          }}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
          }}
        />
        <CardContent>
          <Typography variant="subtitle1" align="center">
            Cost:{product.cost}
          </Typography>
          <Typography variant="subtitle1" align="center">
            Avaialble:{product.amountAvailable}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              color="primary"
              onClick={() => handleChange("decrease")}
            >
              -
            </Button>
            <Typography variant="body2" color="text.secondary">
              {amount}
            </Typography>
            <Button
              size="small"
              color="primary"
              onClick={() => handleChange("increase")}
            >
              +
            </Button>
          </Box>
        </CardContent>
        <CardActions>
          <Button fullWidth variant={"contained"} onClick={handleBuy}>
            {"Buy"}
          </Button>
          <Button fullWidth variant={"outlined"} onClick={handleDelete}>
            {"Delete"}
          </Button>
        </CardActions>
      </Card>
      <SnackbarComponent error={error} />
    </Grid>
  );
}
