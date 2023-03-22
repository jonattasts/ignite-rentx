import React from "react";
import { FlatList } from "react-native";
import {
  CarImage,
  CarImageWrapper,
  Container,
  ImageIndex,
  ImageIndexes,
} from "./styles";

interface Props {
  imagesUrl: string[];
}

export function ImageSlider({ imagesUrl }: Props) {
  return (
    <Container>
      <ImageIndexes>
        <ImageIndex active={true} />
        <ImageIndex active={false} />
        <ImageIndex active={false} />
        <ImageIndex active={false} />
      </ImageIndexes>

      <FlatList
        data={imagesUrl}
        keyExtractor={(item) => String(Math.random())}
        renderItem={({ item }) => (
          <CarImageWrapper>
            <CarImage
              source={{
                uri: item,
              }}
              resizeMode="contain"
            />
          </CarImageWrapper>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  );
}
