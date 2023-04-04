import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components";
import { StyleProp, TextInputProps, ViewStyle } from "react-native";

import { Container, IconContainer, InputText } from "./styles";

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>["name"];
  value: string;
  style?: StyleProp<ViewStyle>;
}

export function Input({
  iconName,
  value,
  style,
  editable = true,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const theme = useTheme();

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  useEffect(() => {
    setIsFilled(!!editable && !!value);
  }, []);

  return (
    <Container style={style} isFocused={isFocused}>
      <IconContainer>
        <Feather
          name={iconName}
          size={24}
          color={
            isFocused || isFilled
              ? theme.colors.main
              : !editable
              ? theme.colors.shape
              : theme.colors.text_detail
          }
        />
      </IconContainer>

      <InputText
        placeholderTextColor={theme.colors.text_detail}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        editable={editable}
        {...rest}
      />
    </Container>
  );
}
