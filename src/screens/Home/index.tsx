import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Car } from "../../components/Car";

import Logo from "../../assets/logo.svg";

import { RootStackParamList } from "../../routes/types.routes";

import { api } from "../../services/api";

import { CarList, Container, Header, HeaderContent, TotalCars } from "./styles";

import { CarDTO } from "../../dtos/CarDTO";
import { Load } from "../../components/Load";

export function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [cars, setCars] = useState<CarDTO[]>();
  const [loading, setLoading] = useState(true);

  function handleCarDetails() {
    navigation.navigate("CarDetails");
  }

  async function fetchCars() {
    try {
      const response = await api.get("cars");

      setCars(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);

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

      {loading ? (
        <Load />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Car data={item} onPress={handleCarDetails} />
          )}
        />
      )}
    </Container>
  );
}
