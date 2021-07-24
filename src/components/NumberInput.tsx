import {
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  useNumberInput,
  UseNumberInputProps,
  useUpdateEffect
} from "@chakra-ui/react";
import * as React from "react";

function NumberInputWithButtons({
  value,
  onChange,
  useNumberInputProps,
}: {
  value: number;
  onChange(value: number): void;
  useNumberInputProps?: UseNumberInputProps;
}) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      value,
      onChange(e) {
        onChange(Number(e));
      },
      ...useNumberInputProps,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps({});

  return (
    <HStack spacing={2} maxWidth="160px">
      <IconButton aria-label="minus" {...dec} icon={<>➖</>} />
      <Input {...input} />
      <IconButton aria-label="plus" {...inc} icon={<>➕</>} />
    </HStack>
  );
}

export function IntInput({
  value: valueFromProps,
  onChange,
  ...props
}: Omit<NumberInputProps, "value" | "onChange"> & {
  value: number;
  onChange(value: number): void;
}) {
  const [lastValidValue, setLastValidValue] =
    React.useState<number>(valueFromProps);
  const [inputValue, setInputValue] = React.useState<string>(() =>
    valueFromProps.toString()
  );
  useUpdateEffect(() => {
    if (valueFromProps !== lastValidValue) setLastValidValue(valueFromProps);
  }, [valueFromProps]);
  useUpdateEffect(() => {
    const value = parseInt(inputValue);
    if (
      !isNaN(value) &&
      (props.min === undefined || isNotSmaller(value, props.min)) &&
      (props.max === undefined || isNotSmaller(props.max, value))
    )
      setLastValidValue(value);
  }, [inputValue]);
  useUpdateEffect(() => {
    if (valueFromProps !== lastValidValue) onChange(lastValidValue);
    if (inputValue !== lastValidValue.toString())
      setInputValue(lastValidValue.toString());
  }, [lastValidValue]);
  useUpdateEffect(() => {
    if (props.min !== undefined && isNotSmaller(props.min, lastValidValue))
      setLastValidValue(props.min);

    if (props.max !== undefined && isNotSmaller(lastValidValue, props.max))
      setLastValidValue(props.max);
  }, [props.min, props.max]);

  return (
    <NumberInput
      {...props}
      precision={0}
      value={inputValue}
      onChange={(e) => setInputValue(e)}
      onBlur={() => setInputValue(lastValidValue.toString())}
    >
      <NumberInputField />
    </NumberInput>
  );
}

function isNotSmaller(a: number, b: number) {
  return !(!isNaN(a) && !isNaN(b) && a < b);
}
