import { Typography } from "@mui/material";

export default function EmptyStateComponent({
  isLoading,
}: {
  isLoading: boolean;
}) {
  return (
    <Typography variant="h6">
      {isLoading ? "Loading..." : "There is no product"}
    </Typography>
  );
}
