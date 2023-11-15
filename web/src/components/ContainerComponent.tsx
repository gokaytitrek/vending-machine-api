import { Button, Card, CardActions, CardContent } from "@mui/material";

type ContainerComponentType = {
  buttonText: string;
  handleClick(): void;
  secondaryButton?: string;
  handleSecondary?: () => void;
};

export default function ContainerComponent({
  children,
  buttonText,
  handleClick,
  secondaryButton,
  handleSecondary,
}: React.PropsWithChildren<ContainerComponentType>) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        backgroundColor: "lightgrey",
        marginTop: "10px",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 345,
          backgroundColor: "lightgrey",
          marginTop: "10px",
        }}
      >
        {children}
      </CardContent>
      <CardActions>
        <Button onClick={handleClick}>{buttonText}</Button>
      </CardActions>
      {secondaryButton && (
        <CardActions>
          <Button onClick={handleSecondary}>{secondaryButton}</Button>
        </CardActions>
      )}
    </Card>
  );
}
