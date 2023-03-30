import React, { useEffect, useState } from "react";
import { BackHandler, StatusBar, ToastAndroid } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  StackActions,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components";

import { Car } from "../../components/Car";
import { Load } from "../../components/Load";

import Logo from "../../assets/logo.svg";
import { RootStackParamList } from "../../routes/types.routes";

import { CarDTO } from "../../dtos/CarDTO";
import { api } from "../../services/api";

import {
  CarList,
  Container,
  Header,
  HeaderContent,
  TotalCars,
  MyCarsButton,
} from "./styles";

export function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [cars, setCars] = useState<CarDTO[]>();
  const [loading, setLoading] = useState(true);
  const [exitApp, setExitApp] = useState(false);
  const theme = useTheme();
  const navigationState = useNavigationState((state) => state);
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
        navigation.dispatch(StackActions.pop(1));
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
        <Load />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Car data={item} onPress={() => handleCarDetails(item)} />
          )}
        />
      )}

      <MyCarsButton onPress={handleOpenMyCars}>
        <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape} />
      </MyCarsButton>
    </Container>
  );
}
