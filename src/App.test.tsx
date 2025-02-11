import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Banking App", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("renders welcome message", () => {
    render(<App />);
    expect(screen.getByText("Welcome to AwesomeGIC Bank!")).toBeInTheDocument();
  });

  it("shows empty state when viewing statement with no transactions", async () => {
    render(<App />);
    const statementButton = screen.getByText("Print Statement");
    await userEvent.click(statementButton);

    expect(screen.getByText("No transactions")).toBeInTheDocument();
    expect(
      screen.getByText("Get started by making a deposit or withdrawal")
    ).toBeInTheDocument();
  });

  it("handles deposit flow correctly", async () => {
    render(<App />);
    const depositButton = screen.getByText("Deposit");
    await userEvent.click(depositButton);

    const input = screen.getByPlaceholderText("0.00");
    await userEvent.type(input, "100");

    const submitButton = screen.getByText("Confirm");
    await userEvent.click(submitButton);

    expect(
      screen.getByText("Thank you. $100.00 has been deposited.")
    ).toBeInTheDocument();
    expect(localStorage.getItem("balance")).toBe("100");
  });

  it("handles withdrawal flow correctly", async () => {
    // Set initial balance
    localStorage.setItem("balance", "200");

    render(<App />);
    const withdrawButton = screen.getByText("Withdraw");
    await userEvent.click(withdrawButton);

    const input = screen.getByPlaceholderText("0.00");
    await userEvent.type(input, "50");

    const submitButton = screen.getByText("Confirm");
    await userEvent.click(submitButton);

    expect(
      screen.getByText("Thank you. $50.00 has been withdrawn.")
    ).toBeInTheDocument();
    expect(localStorage.getItem("balance")).toBe("150");
  });

  it("shows error for insufficient funds", async () => {
    localStorage.setItem("balance", "50");

    render(<App />);
    const withdrawButton = screen.getByText("Withdraw");
    await userEvent.click(withdrawButton);

    const input = screen.getByPlaceholderText("0.00");
    await userEvent.type(input, "100");

    const submitButton = screen.getByText("Confirm");
    await userEvent.click(submitButton);

    expect(screen.getByText("Insufficient funds")).toBeInTheDocument();
  });

  it("shows transactions in statement after operations", async () => {
    render(<App />);

    // Make a deposit
    const depositButton = screen.getByText("Deposit");
    await userEvent.click(depositButton);
    await userEvent.type(screen.getByPlaceholderText("0.00"), "100");
    await userEvent.click(screen.getByText("Confirm"));

    // View statement
    const statementButton = within(
      screen.getByTestId("success-modal")
    ).getByText("Print Statement");
    await userEvent.click(statementButton);

    expect(screen.getAllByText("$100.00").length).toEqual(3);
    expect(screen.queryByText("No transactions")).not.toBeInTheDocument();
  });

  it("clears data when quitting", async () => {
    // Set initial data
    localStorage.setItem("balance", "100");
    localStorage.setItem(
      "transactions",
      JSON.stringify([{ amount: 100, balance: 100, date: new Date() }])
    );

    render(<App />);
    const quitButton = screen.getByText("Quit");
    await userEvent.click(quitButton);

    expect(localStorage.getItem("balance")).toBeNull();
    expect(localStorage.getItem("transactions")).toBeNull();
  });
});
