import React from "react";
import { StatusBar } from "react-native";
import { CarList, Container, Header, HeaderContent, TotalCars } from "./styles";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Car } from "../../components/Car";

import Logo from "../../assets/logo.svg";

import { RootStackParamList } from "../../routes/types.routes";


export function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const carData1 = {
    brand: "Audi",
    name: "RS 5 Coupé",
    period: "AO DIA",
    price: 120,
    thumbnail:
      "https://platform.cstatic-images.com/xlarge/in/v2/stock_photos/ff98bbd8-d0bf-4e53-9235-c15ce2d83e12/19a10394-006c-42eb-a01a-a0c3116d61c2.png",
  };

  const carData2 = {
    brand: "Porsche",
    name: "Panamera",
    period: "AO DIA",
    price: 340,
    thumbnail:
      "https://www.pngkit.com/png/full/237-2375888_porsche-panamera-s.png",
  };

  function handleCarDetails() {
    navigation.navigate("CarDetails");
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent
      />

      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />

          <TotalCars>Total de 12 carros</TotalCars>
        </HeaderContent>
      </Header>

      <CarList
        data={[carData1, carData2]}
        keyExtractor={(item) => String(Math.random())}
        renderItem={({ item }) => (
          <Car data={item} onPress={handleCarDetails} />
        )}
      />
    </Container>
  );
}
