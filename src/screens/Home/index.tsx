import React, { useEffect, useState } from "react";
import { BackHandler, StatusBar, ToastAndroid } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  StackActions,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "styled-components";

import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";
import { AnimatedFloatingButton } from "../../components/AnimatedFloatingButton";

import Logo from "../../assets/logo.svg";
import { RootStackParamList } from "../../routes/types.routes";

import { CarDTO } from "../../dtos/CarDTO";
import { api } from "../../services/api";

import { CarList, Container, Header, HeaderContent, TotalCars } from "./styles";

export function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [cars, setCars] = useState<CarDTO[]>();
  const [loading, setLoading] = useState(true);
  const [exitApp, setExitApp] = useState(false);
  const navigationState = useNavigationState((state) => state);

  const theme = useTheme();

  const showToast = () => {
    ToastAndroid.show(
      "Pressione novamente para sair do App!",
      ToastAndroid.LONG
    );
  };

  function handleCarDetails(car: CarDTO) {
    navigation.navigate("CarDetails", { car: car });
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

  function handleOpenMyCars() {
    navigation.navigate("MyCars");
  }

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (navigationState.index === 0) {
        if (exitApp) {
          setExitApp(false);
          BackHandler.exitApp();
        } else {
          showToast();
          setExitApp(true);
        }
      } else {
        setExitApp(false);
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }

      return true;
    });
  }, [navigationState, exitApp]);

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

          {!loading && <TotalCars>Total de {cars.length} carros</TotalCars>}
        </HeaderContent>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
        />
      )}

      {!loading && (
        <AnimatedFloatingButton
          icon="ios-car-sport"
          onPress={handleOpenMyCars}
        />
      )}
    </Container>
  );
}
