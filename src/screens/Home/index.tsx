import React, { useEffect, useState } from "react";
import { BackHandler, StatusBar, ToastAndroid } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { useNetInfo } from "@react-native-community/netinfo";
import { synchronize } from "@nozbe/watermelondb/sync";

import { database } from "../../database";
import { api } from "../../services/api";
import { Car as ModelCar } from "../../database/model/Car";

import { Car } from "../../components/Car";
import { LoadAnimation } from "../../components/LoadAnimation";

import Logo from "../../assets/logo.svg";
import { RootStackParamList } from "../../routes/types.routes";

import { CarList, Container, Header, HeaderContent, TotalCars } from "./styles";
import { CarDTO } from "../../dtos/CarDTO";

export function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [cars, setCars] = useState<ModelCar[]>([] as ModelCar[]);
  const [loading, setLoading] = useState(true);
  const [exitApp, setExitApp] = useState(false);
  const navigationState = useNavigationState((state) => state);
  const netInfo = useNetInfo();

  const showToast = () => {
    ToastAndroid.show(
      "Pressione novamente para sair do App!",
      ToastAndroid.LONG
    );
  };

  function serializeCar(car: ModelCar) {
    const { id, brand, name, about, period, price, fuel_type, thumbnail } = car;

    const carSerialized = {
      id,
      brand,
      name,
      about,
      period,
      price,
      fuel_type,
      thumbnail,
    };

    return carSerialized as CarDTO;
  }

  function handleCarDetails(car: ModelCar) {
    const carSerialized = serializeCar(car);

    navigation.navigate("CarDetails", { car: carSerialized });
  }

  async function fetchCars() {
    try {
      const carCollection = database.get<ModelCar>("cars");
      const cars = await carCollection.query().fetch();

      setCars(cars);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api.get(
          `cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
        );

        const { changes, latestVersion } = response.data;

        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;

        if (user.updated.length > 0) {
          await api.post("/users/sync", user);
        }
      },
    });

    await fetchCars();
  }

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchCars();
    }

    return () => {
      isMounted = false;
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

  useEffect(() => {
    const syncChanges = async () => {
      if (netInfo.isConnected) {
        try {
          await offlineSynchronize();
        } catch (err) {
          console.log(err);
        }
      }
    };

    syncChanges();
  }, [netInfo.isConnected]);

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
