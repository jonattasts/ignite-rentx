import React from "react";

import { Accessory } from "../../components/Accessory";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Button } from "../../components/Button";

import speedSvg from "../../assets/speed.svg";
import accelerationSvg from "../../assets/acceleration.svg";
import forceSvg from "../../assets/force.svg";
import gasolineSvg from "../../assets/gasoline.svg";
import exchangeSvg from "../../assets/exchange.svg";
import peopleSvg from "../../assets/people.svg";

import {
  Container,
  Header,
  CarImages,
  Content,
  Brand,
  Description,
  Details,
  Name,
  Period,
  Price,
  Rent,
  About,
  Accessories,
  Footer,
} from "./styles";

export function CarDetails() {
  return (
    <Container>
      <Header>
        <BackButton onPress={() => {}} />
      </Header>

      <CarImages>
        <ImageSlider
          imagesUrl={[
            "https://www.pngmart.com/files/10/Lamborghini-Huracan-Download-PNG-Image.png",
          ]}
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>Lamborghini</Brand>
            <Name>Huracan</Name>
          </Description>

          <Rent>
            <Period>Ao dia</Period>
            <Price>R$ 580</Price>
          </Rent>
        </Details>

        <Accessories>
          <Accessory name={"380Km/h"} icon={speedSvg} />
          <Accessory name={"3.2s"} icon={accelerationSvg} />
          <Accessory name={"800 HP"} icon={forceSvg} />
          <Accessory name={"Gasolina"} icon={gasolineSvg} />
          <Accessory name={"Auto"} icon={exchangeSvg} />
          <Accessory name={"2 pessoas"} icon={peopleSvg} />
        </Accessories>

        <About>
          O superesportivo italiano chega à linha 2022 sem alterações em relação
          ao ano anterior. Seu motor é um V10 5.2 de 640 cv e 61,2 kgfm acoplado
          sempre a uma transmissão DCT de 7 velocidades e tração integral.
        </About>
      </Content>

      <Footer>
        <Button
          title="Escolher período do aluguel"
          onPress={() => {}}
          disabled={false}
        />
      </Footer>
    </Container>
  );
}
