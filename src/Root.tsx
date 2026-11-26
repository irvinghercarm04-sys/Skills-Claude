import React from "react";
import { Composition } from "remotion";
import { PizzaBox } from "./PizzaBox";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PizzaBox"
    component={PizzaBox}
    durationInFrames={210}
    fps={30}
    width={1080}
    height={1080}
  />
);
