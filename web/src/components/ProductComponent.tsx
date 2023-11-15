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
} from "@mui/material";
import { useState } from "react";

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
    <Card
      sx={{
        width: 200,
        maxHeight: 350,
        backgroundColor: "lightgrey",
        margin: "10px",
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.productName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`Available: ${product.amountAvailable}`}</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`Cost: ${product.cost}`}</Typography>
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

      {error && (
        <CardContent>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </CardContent>
      )}
      <CardActions>
        <Button size="small" color="primary" onClick={handleBuy}>
          Buy
        </Button>
        <Button size="small" color="secondary" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
