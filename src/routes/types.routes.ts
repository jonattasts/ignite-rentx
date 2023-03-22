import { CarDTO } from "./../dtos/CarDTO";

export type RootStackParamList = {
  Home: undefined;
  CarDetails: undefined | { car: CarDTO };
  Scheduling: undefined | {};
  SchedulingDetails: undefined | {};
  Confirmation: undefined;
};
