import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Products from "./pages/Products";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("loads and displays products", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        id: 1,
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker",
        price: 24.99,
        quantity: 10
      },
      {
        id: 2,
        name: "Wireless Headphones",
        description: "Bluetooth headphones",
        price: 59.99,
        quantity: 15
      }
    ]
  });

  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

  expect(
    await screen.findByText("Bluetooth Speaker")
  ).toBeTruthy();

  expect(
    screen.getByText("Wireless Headphones")
  ).toBeTruthy();
});

test("filters products by search text", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        id: 1,
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker",
        price: 24.99,
        quantity: 10
      },
      {
        id: 2,
        name: "Coffee Maker",
        description: "Coffee maker",
        price: 49.99,
        quantity: 5
      }
    ]
  });

  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

  await screen.findByText("Bluetooth Speaker");

  fireEvent.change(
    screen.getByPlaceholderText("Search products..."),
    {
      target: {
        value: "Coffee"
      }
    }
  );

  expect(
    screen.getByText("Coffee Maker")
  ).toBeTruthy();

  expect(
    screen.queryByText("Bluetooth Speaker")
  ).toBeNull();
});

test("sorts products from low price to high price", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        id: 1,
        name: "Wireless Headphones",
        description: "Bluetooth headphones",
        price: 59.99,
        quantity: 15
      },
      {
        id: 2,
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker",
        price: 24.99,
        quantity: 10
      }
    ]
  });

  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

  await screen.findByText("Bluetooth Speaker");

  fireEvent.change(
    screen.getByRole("combobox"),
    {
      target: {
        value: "low"
      }
    }
  );

  await waitFor(() => {
    const productNames = screen.getAllByRole("heading", {
      level: 5
    });

    expect(productNames[0].textContent)
      .toBe("Bluetooth Speaker");

    expect(productNames[1].textContent)
      .toBe("Wireless Headphones");
  });
});

test("shows error when product request fails", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false
  });

  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

  expect(
    await screen.findByText("Unable to load products.")
  ).toBeTruthy();
});