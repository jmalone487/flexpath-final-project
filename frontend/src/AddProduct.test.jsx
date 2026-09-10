import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import AddProduct from "./pages/AddProduct";

beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.setItem("token", "test-token");
  window.alert = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("renders add product form", () => {
  render(<AddProduct />);

  expect(
    screen.getByRole("heading", { name: "Add Product" })
  ).toBeTruthy();

  expect(screen.getByLabelText("Product Name")).toBeTruthy();
  expect(screen.getByLabelText("Description")).toBeTruthy();
  expect(screen.getByLabelText("Price")).toBeTruthy();
  expect(screen.getByLabelText("Quantity")).toBeTruthy();
  expect(screen.getByLabelText("Category ID")).toBeTruthy();
});

test("submits a new product", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status: 400,
  });

  render(<AddProduct />);

  fireEvent.change(screen.getByLabelText("Product Name"), {
    target: { value: "Bluetooth Speaker" },
  });

  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Portable wireless speaker" },
  });

  fireEvent.change(screen.getByLabelText("Price"), {
    target: { value: "24.99" },
  });

  fireEvent.change(screen.getByLabelText("Quantity"), {
    target: { value: "10" },
  });

  fireEvent.change(screen.getByLabelText("Category ID"), {
    target: { value: "1" },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add Product",
    })
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/products",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        }),
      })
    );
  });
});

test("shows alert when submission fails", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
  });

  render(<AddProduct />);

  fireEvent.change(screen.getByLabelText("Product Name"), {
    target: { value: "Test Product" },
  });

  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Test description" },
  });

  fireEvent.change(screen.getByLabelText("Price"), {
    target: { value: "10.00" },
  });

  fireEvent.change(screen.getByLabelText("Quantity"), {
    target: { value: "5" },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add Product",
    })
  );

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(
      "Unable to add product. Status: 500"
    );
  });
});