import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { useTheme } from "styled-components";
import { useNetInfo } from "@react-native-community/netinfo";

import { Accessory } from "../../components/Accessory";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Button } from "../../components/Button";
import { Load } from "../../components/Load";

import { getAccessoryIcon } from "../../utils/getAccessoryIcon";
import { CarDTO } from "../../dtos/CarDTO";
import { RootStackParamList } from "../../routes/types.routes";
import { api } from "../../services/api";

import {
  Container,
  Header,
  CarImages,
  Brand,
  Description,
  Details,
  Name,
  Period,
  Price,
  Rent,
  About,
  Accessories,
  Footer,
  OfflineInfo,
} from "./styles";

interface Params {
  car: CarDTO;
}

export function CarDetails() {
  const [car, setCar] = useState<CarDTO>({} as CarDTO);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const theme = useTheme();
  const netInfo = useNetInfo();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 200],
        [200, 100],
        Extrapolate.CLAMP
      ),
    };
  });

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 150], [1, 0], Extrapolate.CLAMP),
    };
  });

  function handleConfirmRental() {
    navigation.navigate("Scheduling", { car });
  }

  useEffect(() => {
    if (netInfo.isConnected !== null) {
      setLoading(true);
    }

    setIsConnected(netInfo.isConnected);
  }, [netInfo.isConnected]);

  useEffect(() => {
    const { car } = route.params as Params;

    async function fetchOnlineData() {
      const response = await api.get(`cars/${car.id}`);

      setCar(response.data);
      setLoading(false);
    }

    if (isConnected) {
      fetchOnlineData();
    } else if (isConnected === false) {
      setCar(car);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [isConnected]);

  return (
    <Container>
      {loading ? (
        <Load />
      ) : (
        <>
          <Animated.View
            style={[
              headerStyleAnimation,
              styles.header,
              { backgroundColor: theme.colors.background_secondary },
            ]}
          >
            <Header>
              <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
              />

              <BackButton onPress={() => navigation.goBack()} />
            </Header>

            <Animated.View style={sliderCarsStyleAnimation}>
              <CarImages>
                <ImageSlider
                  imagesUrl={
                    !!car.photos
                      ? car.photos
                      : [{ id: car.thumbnail, photo: car.thumbnail }]
                  }
                />
              </CarImages>
            </Animated.View>
          </Animated.View>

          <Animated.ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: getStatusBarHeight() + 160,
            }}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            <Details>
              <Description>
                <Brand>{car.brand}</Brand>
                <Name>{car.name}</Name>
              </Description>

              <Rent>
                <Period>{car.period}</Period>
                <Price>{`R$ ${isConnected ? car.price : "..."}`}</Price>
              </Rent>
            </Details>

            {car.accessories && (
              <Accessories>
                {car.accessories.map((accessory) => (
                  <Accessory
                    key={accessory.type}
                    name={accessory.name}
                    icon={getAccessoryIcon(accessory.type)}
                  />
                ))}
              </Accessories>
            )}

            <About>{car.about}</About>
          </Animated.ScrollView>
          <Footer>
            <Button
              enabled={!!isConnected}
              title="Escolher período do aluguel"
              onPress={handleConfirmRental}
            />

            {isConnected === false && (
              <OfflineInfo>
                Conecte-se a internet para ver mais detalhes e agendar seu
                carro.
              </OfflineInfo>
            )}
          </Footer>
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    overflow: "hidden",
    zIndex: 1,
  },
});
