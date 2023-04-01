import { CarDTO } from "../dtos/CarDTO";
import { UserDTO } from "../dtos/UserDTO";

export interface CarDetailsParamList {
  car: CarDTO;
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
  screenToNavigate:
    | "Splash"
    | "SignIn"
    | "SignUpFirstStep"
    | "SignUpSecondStep"
    | "Home"
    | "CarDetails"
    | "MyCars"
    | "Scheduling"
    | "SchedulingDetails"
    | "Confirmation";
  message?: string;
}
