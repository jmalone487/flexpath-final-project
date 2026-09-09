import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import EditProduct from "./pages/EditProduct";

beforeEach(() => {
  global.fetch = jest.fn();
  window.alert = jest.fn();
  localStorage.setItem("token", "test-token");
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

function renderEditProduct() {
  return render(
    <MemoryRouter initialEntries={["/products/1/edit"]}>
      <Routes>
        <Route
          path="/products/:id/edit"
          element={<EditProduct />}
        />
      </Routes>
    </MemoryRouter>
  );
}

test("loads existing product data", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      id: 1,
      name: "Bluetooth Speaker",
      description: "Portable wireless speaker",
      price: 24.99,
      quantity: 10,
      public: true,
      categoryId: 1,
    }),
  });

  renderEditProduct();

  expect(
    await screen.findByDisplayValue("Bluetooth Speaker")
  ).toBeTruthy();

  expect(
    screen.getByDisplayValue("Portable wireless speaker")
  ).toBeTruthy();

  expect(screen.getByDisplayValue("24.99")).toBeTruthy();
  expect(screen.getByDisplayValue("10")).toBeTruthy();
});

test("updates product successfully", async () => {
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker",
        price: 24.99,
        quantity: 10,
        public: true,
        categoryId: 1,
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
    });

  renderEditProduct();

  const nameInput =
    await screen.findByDisplayValue("Bluetooth Speaker");

  fireEvent.change(nameInput, {
    target: {
      value: "Updated Speaker",
    },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: /update|save/i,
    })
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products/1",
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        }),
      })
    );
  });
});

test("shows alert when update fails", async () => {
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker",
        price: 24.99,
        quantity: 10,
        public: true,
        categoryId: 1,
      }),
    })
    .mockResolvedValueOnce({
      ok: false,
    });

  renderEditProduct();

  await screen.findByDisplayValue("Bluetooth Speaker");

  fireEvent.click(
    screen.getByRole("button", {
      name: /update|save/i,
    })
  );

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled();
  });
});

test("shows error when product cannot load", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
  });

  renderEditProduct();

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled();
  });
});