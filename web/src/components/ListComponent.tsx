import { Container, Grid } from "@mui/material";
import EmptyStateComponent from "@/components/EmptyStateComponent";
import ProductComponent from "./ProductComponent";
import { useProductData } from "@/providers/DataProvider";

export default function ListComponent() {
  const { products, isLoading } = useProductData();

  return products.length <= 0 ? (
    <EmptyStateComponent isLoading={isLoading} />
  ) : (
    <Container maxWidth="md" component="main">
      <Grid container spacing={5} alignItems="flex-end">
        {products.map((product) => (
          <ProductComponent key={product._id} product={product} />
        ))}
      </Grid>
    </Container>
  );
}
