import React, { useState, useEffect } from "react";
import { StatusBar, FlatList } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";

import { BackButton } from "../../components/BackButton";
import { Load } from "../../components/Load";
import { LoadAnimation } from "../../components/LoadAnimation";

import { Car } from "../../components/Car";
import { api } from "../../services/api";
import { RootStackParamList } from "../../routes/types.routes";
import { Car as ModelCar } from "../../database/model/Car";

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from "./styles";
import { serializeCar } from "../../utils/serializeCar";
import { getPlatformDate } from "../../utils/getPlatformDate";

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAtEndList, setIsAtEndList] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const screenIsFocused = useIsFocused();
  const theme = useTheme();

  function handleBack() {
    navigation.goBack();
  }

  function handleCarDetails(car: ModelCar) {
    const carSerialized = serializeCar(car);

    navigation.navigate("CarDetails", {
      car: carSerialized,
      isScheduleable: false,
    });
  }

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);

      try {
        const response = await api.get("/rentals");

        const dataFormatted = response.data.map((data: DataProps) => {
          return {
            id: data.id,
            car: data.car,
            start_date: format(
              getPlatformDate(new Date(data.start_date)),
              "dd/MM/yyyy"
            ),
            end_date: format(
              getPlatformDate(new Date(data.end_date)),
              "dd/MM/yyyy"
            ),
          };
        });

        const dataSorted = dataFormatted.sort(
          (d1: DataProps, d2: DataProps) =>
            new Date(d1.start_date.split("/").reverse().join("-")).getTime() -
            new Date(d2.start_date.split("/").reverse().join("-")).getTime()
        );

        setCars(dataSorted);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, [screenIsFocused]);

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        <BackButton onPress={handleBack} color={theme.colors.shape} />

        <Title>
          Escolha uma {"\n"}
          data de início e {"\n"}
          fim do aluguel
        </Title>

        <SubTitle>Conforto, segurança e praticidade.</SubTitle>
      </Header>

      {loading ? (
        <LoadAnimation />
      ) : (
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>

          {cars.length > 0 && (
            <FlatList
              data={cars}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <CarWrapper>
                  <Car
                    data={item.car}
                    onPress={() => handleCarDetails(item.car)}
                  />
                  <CarFooter>
                    <CarFooterTitle>Período</CarFooterTitle>

                    <CarFooterPeriod>
                      <CarFooterDate>{item.start_date}</CarFooterDate>
                      <AntDesign
                        name="arrowright"
                        size={20}
                        color={theme.colors.title}
                        style={{ marginHorizontal: 10 }}
                      />
                      <CarFooterDate>{item.end_date}</CarFooterDate>
                    </CarFooterPeriod>
                  </CarFooter>
                </CarWrapper>
              )}
              onScroll={(event) => {
                const isAtEnd =
                  event.nativeEvent.contentOffset.y +
                    event.nativeEvent.layoutMeasurement.height >
                  event.nativeEvent.contentSize.height;

                if (!isAtEndList && isAtEnd) {
                  setIsAtEndList(isAtEnd);
                }
              }}
              ListFooterComponent={() =>
                !isAtEndList && cars.length > 2 ? <Load /> : null
              }
            />
          )}
        </Content>
      )}
    </Container>
  );
}
