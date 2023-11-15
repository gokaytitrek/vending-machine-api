import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

type ListComponentType = {
  title: string;
  value: string | null;
  options: {
    value: string;
    label: string;
  }[];

  handleChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

export default function RadioComponent(props: ListComponentType) {
  return (
    <FormControl className="bg-gray-700">
      <FormLabel>{props.title}</FormLabel>
      <RadioGroup value={props.value} onChange={props.handleChange}>
        {props.options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
