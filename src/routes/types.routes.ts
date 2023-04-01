import {
  CarDetailsParamList,
  ConfirmationParamList,
  SchedulingDetailsParamList,
  SchedulingParamList,
  SignUpSecondStepParamList,
} from "./paramList.routes";

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  SignUpFirstStep: undefined;
  SignUpSecondStep: SignUpSecondStepParamList;
  Home: undefined;
  CarDetails: CarDetailsParamList;
  MyCars: undefined;
  Scheduling: SchedulingParamList;
  SchedulingDetails: SchedulingDetailsParamList;
  Confirmation: ConfirmationParamList;
};
