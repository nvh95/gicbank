import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  DocumentTextIcon,
  ArrowRightCircleIcon,
  ExclamationCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import type { Transaction, Action } from "./types";
import clsx from "clsx";

type MessageType = {
  id: string;
  text: string;
  type: "success" | "error";
  timestamp: number;
};

type SuccessModalType = {
  action: "deposit" | "withdraw";
  amount: number;
} | null;

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentAction, setCurrentAction] = useState<Action | null>(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("balance");
    return saved ? parseFloat(saved) : 0;
  });
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [successModal, setSuccessModal] = useState<SuccessModalType>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [balance, transactions]);

  useEffect(() => {
    if (successModal) {
      modalRef.current?.focus();
    }
  }, [successModal]);

  const addMessage = (text: string, type: "success" | "error") => {
    const newMessage: MessageType = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    }, 3000);
  };

  const handleAction = (action: Action) => {
    if (action === "quit") {
      localStorage.removeItem("balance");
      localStorage.removeItem("transactions");
      setCurrentAction("quit");
      setSuccessModal(null);
      return;
    }
    setCurrentAction(action);
    setAmount("");
    setSuccessModal(null);
  };

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      addMessage("Please enter a valid positive amount", "error");
      return;
    }

    if (currentAction === "withdraw" && numAmount > balance) {
      addMessage("Insufficient funds", "error");
      return;
    }

    const newBalance =
      currentAction === "withdraw" ? balance - numAmount : balance + numAmount;

    const newTransaction: Transaction = {
      date: new Date(),
      amount: currentAction === "withdraw" ? -numAmount : numAmount,
      balance: newBalance,
    };

    setTransactions([...transactions, newTransaction]);
    setBalance(newBalance);
    setAmount("");
    setSuccessModal({
      action: currentAction as "deposit" | "withdraw",
      amount: numAmount,
    });
    setCurrentAction(null);
  };

  if (currentAction === "quit") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Thank you for banking with AwesomeGIC Bank.
          </h1>
          <p className="text-gray-600">Have a nice day!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Error messages */}
      <div className="fixed top-4 right-4 flex flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              "flex items-center px-4 py-3 rounded border",
              "bg-red-100 border-red-400 text-red-700"
            )}
          >
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <span>{message.text}</span>
          </div>
        ))}
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 backdrop-blur-xs bg-white/10"
            onClick={() => setSuccessModal(null)}
          />
          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative bg-white/90 backdrop-blur-xl rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-900"
          >
            <div className="text-center mb-6 mt-2">
              <p className="text-xl text-gray-900 mb-4">
                Thank you. ${successModal.amount.toFixed(2)} has been{" "}
                {successModal.action === "withdraw" ? "withdrawn" : "deposited"}
                .
              </p>
              <p className="text-gray-600">
                Is there anything else you'd like to do?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAction("deposit")}
                className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-green-600 hover:bg-green-700"
              >
                <ArrowUpCircleIcon className="h-5 w-5 mr-2" />
                Deposit
              </button>
              <button
                onClick={() => handleAction("withdraw")}
                className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700"
              >
                <ArrowDownCircleIcon className="h-5 w-5 mr-2" />
                Withdraw
              </button>
              <button
                onClick={() => handleAction("statement")}
                className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Print Statement
              </button>
              <button
                onClick={() => handleAction("quit")}
                className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700"
              >
                <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
                Quit
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setSuccessModal(null)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Return to home page
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Welcome to AwesomeGIC Bank!
          </h1>

          {currentAction === null ? (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                What would you like to do?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAction("deposit")}
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-green-600 hover:bg-green-700"
                >
                  <ArrowUpCircleIcon className="h-5 w-5 mr-2" />
                  Deposit
                </button>
                <button
                  onClick={() => handleAction("withdraw")}
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowDownCircleIcon className="h-5 w-5 mr-2" />
                  Withdraw
                </button>
                <button
                  onClick={() => handleAction("statement")}
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Print Statement
                </button>
                <button
                  onClick={() => handleAction("quit")}
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700"
                >
                  <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
                  Quit
                </button>
              </div>
            </div>
          ) : currentAction === "statement" ? (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Account Statement
              </h2>
              {transactions.length > 0 ? (
                <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(transaction.date, "dd MMM yyyy hh:mm:ssaa")}
                          </td>
                          <td
                            className={clsx(
                              "px-6 py-4 whitespace-nowrap text-sm text-right",
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            {transaction.amount < 0 ? "-" : ""}$
                            {Math.abs(transaction.amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            ${transaction.balance.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No transactions
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by making a deposit or withdrawal
                  </p>
                </div>
              )}
              <button
                onClick={() => setCurrentAction(null)}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Menu
              </button>
            </div>
          ) : (
            <form onSubmit={handleTransaction}>
              <div className="space-y-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Please enter the amount to {currentAction}:
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    step="0.01"
                    min="0"
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 hover:bg-indigo-700"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentAction(null)}
                    className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
