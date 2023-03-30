import React, { useState, useEffect } from "react";
import { StatusBar, FlatList } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation } from "@react-navigation/core";
import { AntDesign } from "@expo/vector-icons";
import { parseISO, format } from "date-fns";

import { BackButton } from "../../components/BackButton";
import { Load } from "../../components/Load";
import { LoadAnimation } from "../../components/LoadAnimation";

import { Car } from "../../components/Car";
import { CarDTO } from "../../dtos/CarDTO";
import { api } from "../../services/api";

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

interface DataProps {
  id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
}

export function MyCars() {
  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAtEndList, setIsAtEndList] = useState(false);

  const navigation = useNavigation();
  const theme = useTheme();

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get("/schedules_byuser?user_id=1");

        const dataFormatted = response.data.map((data: DataProps) => {
          return {
            id: data.id,
            car: data.car,
            startDate: data.startDate,
            endDate: data.endDate,
          };
        });

        const dataSorted = dataFormatted.sort(
          (d1: DataProps, d2: DataProps) =>
            new Date(d1.startDate.split("/").reverse().join("-")).getTime() -
            new Date(d2.startDate.split("/").reverse().join("-")).getTime()
        );

        setCars(dataSorted);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

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

          <FlatList
            data={cars}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>

                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{ marginHorizontal: 10 }}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
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
            ListFooterComponent={() => !isAtEndList && <Load />}
          />
        </Content>
      )}
    </Container>
  );
}
