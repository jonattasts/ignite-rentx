import React, { useEffect, useState } from "react";
import { BackHandler, StatusBar, ToastAndroid } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";

import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";

import Logo from "../../assets/logo.svg";
import { RootStackParamList } from "../../routes/types.routes";

import { CarDTO } from "../../dtos/CarDTO";
import { api } from "../../services/api";

import { CarList, Container, Header, HeaderContent, TotalCars } from "./styles";

export function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [cars, setCars] = useState<CarDTO[]>([] as CarDTO[]);
  const [loading, setLoading] = useState(true);
  const [exitApp, setExitApp] = useState(false);
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

  useEffect(() => {
    let mounted = true;

    async function fetchCars() {
      try {
        const response = await api.get("cars");

        if (mounted) {
          setCars(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();

    return () => {
      mounted = false;
    };
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

  useEffect(() => {
    async function hideSplash() {
      await SplashScreen.hideAsync();
    }

    hideSplash();
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
    </Container>
  );
}
