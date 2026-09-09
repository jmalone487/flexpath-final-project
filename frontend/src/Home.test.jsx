import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./pages/Home";

test("renders Bobbi J home page", () => {
  render(<Home />);

  expect(
    screen.getByText(/Bobbi J/i)
  ).toBeTruthy();
});