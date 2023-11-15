import { Grid } from "@mui/material";
import EmptyStateComponent from "@/components/EmptyStateComponent";
import ProductComponent from "./ProductComponent";
import { useProductData } from "@/providers/DataProvider";

export default function ListComponent() {
  const { products, isLoading } = useProductData();

  return products.length <= 0 ? (
    <EmptyStateComponent isLoading={isLoading} />
  ) : (
    <Grid container spacing={0}>
      {products.map((product) => (
        <ProductComponent key={product._id} product={product} />
      ))}
    </Grid>
  );
}
