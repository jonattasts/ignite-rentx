import React, { useRef, useState } from "react";
import { FlatList, ViewToken } from "react-native";
import { PhotoDTO } from "../../dtos/CarDTO";
import {
  CarImage,
  CarImageWrapper,
  Container,
  ImageIndexes,
  SliderBullet,
} from "./styles";

interface Props {
  imagesUrl: PhotoDTO[];
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
        {imagesUrl.map((item, index) => (
          <SliderBullet
            key={String(item.id)}
            isFirst={index === 0}
            active={index === imageIndex}
          />
        ))}
      </ImageIndexes>

      <FlatList
        horizontal
        data={imagesUrl}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={indexChanged.current}
        renderItem={({ item, index }) => (
          <CarImageWrapper>
            <CarImage
              source={{
                uri: item.photo,
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
