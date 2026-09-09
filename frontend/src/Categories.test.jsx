import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Categories from "./pages/Categories";

beforeEach(() => {
  global.fetch = jest.fn();
  window.confirm = jest.fn();
  window.alert = jest.fn();
  localStorage.setItem("token", "test-token");
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("loads and displays categories", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        id: 1,
        name: "Electronics",
        description: "Phones and accessories",
      },
      {
        id: 2,
        name: "Sports",
        description: "Sports and fitness products",
      },
    ],
  });

  render(
    <MemoryRouter>
      <Categories />
    </MemoryRouter>
  );

  expect(
    await screen.findByText("Electronics")
  ).toBeTruthy();

  expect(
    screen.getByText("Sports")
  ).toBeTruthy();
});

test("shows error when categories cannot load", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
  });

  render(
    <MemoryRouter>
      <Categories />
    </MemoryRouter>
  );

  expect(
    await screen.findByText("Unable to load categories.")
  ).toBeTruthy();
});

test("deletes a category when confirmed", async () => {
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 4,
          name: "Sports",
          description: "Sports and fitness products",
        },
      ],
    })
    .mockResolvedValueOnce({
      ok: true,
    });

  window.confirm.mockReturnValue(true);

  render(
    <MemoryRouter>
      <Categories />
    </MemoryRouter>
  );

  await screen.findByText("Sports");

  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete",
    })
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/categories/4",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  await waitFor(() => {
    expect(
      screen.queryByText("Sports")
    ).toBeNull();
  });
});

test("does not delete category when user cancels", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        id: 4,
        name: "Sports",
        description: "Sports and fitness products",
      },
    ],
  });

  window.confirm.mockReturnValue(false);

  render(
    <MemoryRouter>
      <Categories />
    </MemoryRouter>
  );

  await screen.findByText("Sports");

  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete",
    })
  );

  expect(global.fetch).toHaveBeenCalledTimes(1);
});