import { Car as ModelCar } from "../database/model/Car";
import { CarDTO } from "../dtos/CarDTO";

export function serializeCar(car: ModelCar) {
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
