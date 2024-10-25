import React from "react";
import MyComponent from "./MyComponent";
import Marquee from "react-fast-marquee";

const HomePage = () => (
  <Marquee>
    <MyComponent />
    <MyComponent />
    <MyComponent />
    <MyComponent />
    <MyComponent />
    <MyComponent />
  </Marquee>
);

export default HomePage;