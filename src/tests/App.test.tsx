import { describe, it, expect, beforeEach } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { vi } from "vitest";

describe("Banking App", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    globalThis.jest = {
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };
  });

  // Issue with "user-event" that makes the test hangs
  // https://github.com/testing-library/user-event/issues/1115#issuecomment-1565730917
  const getUserEventInstance = () =>
    userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
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
    vi.useFakeTimers();

    const user = getUserEventInstance();
    localStorage.setItem("balance", "50");

    render(<App />);
    const withdrawButton = screen.getByText("Withdraw");
    await user.click(withdrawButton);

    const input = screen.getByPlaceholderText("0.00");
    await user.type(input, "100");
    await user.type(input, "100");

    const submitButton = screen.getByText("Confirm");
    await user.click(submitButton);

    expect(screen.getByText("Insufficient balance")).toBeInTheDocument();

    // Wait for 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Error message should be gone
    expect(screen.queryByText("Insufficient balance")).not.toBeInTheDocument();

    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it("shows transactions in statement after operations", async () => {
    render(<App />);

    // Make a deposit
    const depositButton = screen.getByText("Deposit");
    await userEvent.click(depositButton);
    await userEvent.type(screen.getByPlaceholderText("0.00"), "100");
    await userEvent.click(screen.getByText("Confirm"));

    // Make a withdrawal
    const withdrawButton = within(
      screen.getByTestId("success-modal")
    ).getByText("Withdraw");
    await userEvent.click(withdrawButton);
    await userEvent.type(screen.getByPlaceholderText("0.00"), "20");
    await userEvent.click(screen.getByText("Confirm"));

    // View statement
    const statementButton = within(
      screen.getByTestId("success-modal")
    ).getByText("Print Statement");
    await userEvent.click(statementButton);

    expect(screen.getAllByText("$100.00").length).toEqual(2);
    expect(screen.getAllByText("-$20.00").length).toEqual(1);
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

    expect(
      screen.queryByText("Thank you for banking with AwesomeGIC Bank.")
    ).toBeInTheDocument();

    // Click on Log In Again
    const loginButton = screen.getByText("Log In Again");
    await userEvent.click(loginButton);

    expect(screen.getByText("Welcome to AwesomeGIC Bank!")).toBeInTheDocument();
    expect(
      screen.queryByText("Thank you for banking with AwesomeGIC Bank.")
    ).not.toBeInTheDocument();
  });

  it("handles all buttons in home page working correctly", async () => {
    render(<App />);
    // Click Deposit
    const depositButton = screen.getByText("Deposit");
    await userEvent.click(depositButton);
    expect(
      screen.getByText("Please enter the amount to deposit:")
    ).toBeInTheDocument();

    const getCancelButton = () => screen.getByText("Cancel");
    await userEvent.click(getCancelButton());

    // Click Withdraw
    const withdrawButton = screen.getByText("Withdraw");
    await userEvent.click(withdrawButton);
    expect(
      screen.getByText("Please enter the amount to withdraw:")
    ).toBeInTheDocument();

    await userEvent.click(getCancelButton());

    // Click Print Statement
    const statementButton = screen.getByText("Print Statement");
    await userEvent.click(statementButton);
    expect(screen.getByText("Account Statement")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Back to Menu"));

    // Click Quit
    const quitButton = screen.getByText("Quit");
    await userEvent.click(quitButton);
    expect(
      screen.queryByText("Thank you for banking with AwesomeGIC Bank.")
    ).toBeInTheDocument();
  });

  async function triggerSuccessModal() {
    // Click Deposit
    const depositButton = screen.getByText("Deposit");
    await userEvent.click(depositButton);

    const input = screen.getByPlaceholderText("0.00");
    await userEvent.type(input, "100");

    const submitButton = screen.getByText("Confirm");
    await userEvent.click(submitButton);
  }

  it("handles all buttons in success modal working correctly", async () => {
    render(<App />);
    await triggerSuccessModal();

    // Click Deposit
    const depositButton = within(screen.getByTestId("success-modal")).getByText(
      "Deposit"
    );
    await userEvent.click(depositButton);
    expect(
      screen.getByText("Please enter the amount to deposit:")
    ).toBeInTheDocument();

    const getCancelButton = () => screen.getByText("Cancel");
    await userEvent.click(getCancelButton());

    // Click Withdraw
    await triggerSuccessModal();
    const withdrawButton = within(
      screen.getByTestId("success-modal")
    ).getByText("Withdraw");
    await userEvent.click(withdrawButton);
    expect(
      screen.getByText("Please enter the amount to withdraw:")
    ).toBeInTheDocument();

    await userEvent.click(getCancelButton());

    // Click Print Statement
    await triggerSuccessModal();
    const statementButton = within(
      screen.getByTestId("success-modal")
    ).getByText("Print Statement");
    await userEvent.click(statementButton);
    expect(screen.getByText("Account Statement")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Back to Menu"));

    // Click Quit
    await triggerSuccessModal();
    const quitButton = within(screen.getByTestId("success-modal")).getByText(
      "Quit"
    );
    await userEvent.click(quitButton);
    expect(
      screen.queryByText("Thank you for banking with AwesomeGIC Bank.")
    ).toBeInTheDocument();
  });

  it("closes success modal when clicking on backdrop", async () => {
    render(<App />);
    await triggerSuccessModal();
    await userEvent.click(screen.getByTestId("modal-backdrop"));
    expect(screen.queryByTestId("success-modal")).not.toBeInTheDocument();
  });
});
