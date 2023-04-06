import { CarDTO } from "../dtos/CarDTO";
import { UserDTO } from "../dtos/UserDTO";

export interface CarDetailsParamList {
  car: CarDTO;
  isScheduleable?: boolean;
}

export interface SchedulingParamList extends CarDetailsParamList {}

export interface SchedulingDetailsParamList extends CarDetailsParamList {
  dates: string[];
}

export interface SignUpSecondStepParamList {
  user: UserDTO;
}

export interface ConfirmationParamList {
  title: string;
  screenToNavigate: "SignIn" | "Home";
  message?: string;
}
