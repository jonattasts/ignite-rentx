import React, { useRef, useState } from "react";
import { FlatList, ViewToken } from "react-native";
import {
  CarImage,
  CarImageWrapper,
  Container,
  ImageIndexes,
  SliderBullet,
} from "./styles";

interface Props {
  imagesUrl: string[];
}

interface ChangeImageProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export function ImageSlider({ imagesUrl }: Props) {
  const [imageIndex, setImageIndex] = useState(0);

  const indexChanged = useRef((info: ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
    setImageIndex(index);
  });

  return (
    <Container>
      <ImageIndexes>
        {imagesUrl.map((url, index) => (
          <SliderBullet
            key={String(index)}
            isFirst={index === 0}
            active={index === imageIndex}
          />
        ))}
      </ImageIndexes>

      <FlatList
        horizontal
        data={imagesUrl}
        keyExtractor={(key) => key}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={indexChanged.current}
        renderItem={({ item, index }) => (
          <CarImageWrapper>
            <CarImage
              source={{
                uri: item,
              }}
              resizeMode="contain"
              active={index === imageIndex}
            />
          </CarImageWrapper>
        )}
      />
    </Container>
  );
}
