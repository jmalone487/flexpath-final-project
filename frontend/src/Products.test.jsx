import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Products from "./pages/Products";

beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.setItem("token", "test-token");
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const bluetoothSpeaker = {
  id: 1,
  name: "Bluetooth Speaker",
  description: "Portable wireless speaker",
  price: 24.99,
  quantity: 10,
  username: "testuser",
  public: true,
};

const wirelessHeadphones = {
  id: 2,
  name: "Wireless Headphones",
  description: "Bluetooth headphones",
  price: 59.99,
  quantity: 15,
  username: "admin",
  public: true,
};

test("loads and displays products", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      bluetoothSpeaker,
      wirelessHeadphones,
    ],
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

test("searches products by name and username", async () => {
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        bluetoothSpeaker,
        wirelessHeadphones,
      ],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [bluetoothSpeaker],
    });

  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

  await screen.findByText("Wireless Headphones");

  fireEvent.change(
    screen.getByPlaceholderText(
      "Search by product name..."
    ),
    {
      target: {
        value: "Bluetooth",
      },
    }
  );

  fireEvent.change(
    screen.getByPlaceholderText(
      "Search by username..."
    ),
    {
      target: {
        value: "testuser",
      },
    }
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Search",
    })
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenLastCalledWith(
      "http://localhost:8080/api/products/search?name=Bluetooth&username=testuser",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer test-token",
        },
      })
    );
  });

  expect(
    await screen.findByText("Bluetooth Speaker")
  ).toBeTruthy();

  expect(
    screen.queryByText("Wireless Headphones")
  ).toBeNull();
});

test("sorts products from low price to high price", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      wirelessHeadphones,
      bluetoothSpeaker,
    ],
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
        value: "price-low",
      },
    }
  );

  await waitFor(() => {
    const productNames = screen.getAllByRole(
      "heading",
      {
        level: 5,
      }
    );

    expect(productNames[0].textContent).toBe(
      "Bluetooth Speaker"
    );

    expect(productNames[1].textContent).toBe(
      "Wireless Headphones"
    );
  });
});

test("shows error when product request fails", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
  });

  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(
      "Unable to load products."
    )
  ).toBeTruthy();
});