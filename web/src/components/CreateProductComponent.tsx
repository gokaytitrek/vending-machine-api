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
import { useProductData } from "@/providers/DataProvider";
import SnackbarComponent from "./SnackBarComponent";

const initialState = {
  name: "",
  amountAvailable: "",
  cost: "",
  error: "",
};

export default function CreateProductComponent() {
  const [product, setProduct] = useState(initialState);
  const { refreshData } = useProductData();

  const handleCreateProduct = async () => {
    try {
      const { status, error } = await post("/product", {
        productName: product.name,
        amountAvailable: Number(product.amountAvailable),
        cost: Number(product.cost),
      });
      if (status === 201) {
        setProduct(initialState);
        refreshData();
      } else {
        setProduct({ ...product, error });
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
        <CardContent sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            required
            label="Product name"
            variant="standard"
            className="bg-gray-700"
            inputProps={{ maxLength: 20 }}
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          <TextField
            required
            label="Amount"
            variant="standard"
            className="bg-gray-700"
            type="number"
            value={product.amountAvailable}
            onChange={(e) =>
              setProduct({ ...product, amountAvailable: e.target.value })
            }
          />
          <TextField
            required
            label="Cost"
            variant="standard"
            className="bg-gray-700"
            type="number"
            value={product.cost}
            onChange={(e) => setProduct({ ...product, cost: e.target.value })}
          />
        </CardContent>
        <CardActions>
          <Button fullWidth variant={"contained"} onClick={handleCreateProduct}>
            {"Create product"}
          </Button>
        </CardActions>
      </Card>
      <SnackbarComponent error={product.error} />
    </>
  );
}
