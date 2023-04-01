import { CarDTO } from "./../dtos/CarDTO";

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  SignUpFirstStep: undefined;
  SignUpSecondStep: { user: {} };
  Home: undefined;
  CarDetails: undefined | { car: CarDTO };
  MyCars: undefined;
  Scheduling: undefined | { car: CarDTO };
  SchedulingDetails: undefined | { car: CarDTO; dates: string[] };
  Confirmation: undefined | {};
};
