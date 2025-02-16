import { useState, useEffect } from "react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import type { Transaction, Action } from "./types";
import ErrorMessages from "./components/ErrorMessages";
import SuccessModal from "./components/SuccessModal";
import TransactionForm from "./components/TransactionForm";
import Statement from "./components/Statement";
import Menu from "./components/Menu";
import Balance from "./components/Balance";

type MessageType = {
  id: string;
  text: string;
};

export type SuccessModalType = {
  action: "deposit" | "withdraw";
  amount: number;
} | null;

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("balance");
    return saved ? parseFloat(saved) : 0;
  });
  const [currentAction, setCurrentAction] = useState<Action | null>(null);
  const [amount, setAmount] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [successModal, setSuccessModal] = useState<SuccessModalType>(null);

  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function addMessage(text: string) {
    const id = Math.random().toString(36).substring(7);
    setMessages((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 3000);
  }

  function handleAction(action: Action) {
    if (action === "quit") {
      localStorage.removeItem("balance");
      localStorage.removeItem("transactions");
      setCurrentAction("quit");
      setSuccessModal(null);
      return;
    }
    setCurrentAction(action);
    setAmount("");
  }

  function handleTransaction(e: React.FormEvent) {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (currentAction === "withdraw" && numAmount > balance) {
      addMessage("Insufficient balance");
      return;
    }

    const newTransaction: Transaction = {
      date: new Date(),
      amount: currentAction === "withdraw" ? -numAmount : numAmount,
      balance:
        currentAction === "withdraw"
          ? balance - numAmount
          : balance + numAmount,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setBalance(newTransaction.balance);
    setSuccessModal({
      action: currentAction as "deposit" | "withdraw",
      amount: numAmount,
    });
    setCurrentAction(null);
    setAmount("");
  }

  function handleLogIn() {
    setCurrentAction(null);
    setBalance(0);
    setTransactions([]);
  }

  if (currentAction === "quit") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-3xl font-semibold text-gray-900 mb-4">
            Thank you for banking with AwesomeGIC Bank.
          </p>
          <p className="text-gray-600 mb-8">Have a nice day!</p>
          <button
            onClick={handleLogIn}
            className="inline-flex items-center px-6 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeftCircleIcon className="h-6 w-6 mr-2 text-white" />
            Log In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 grid place-content-center">
      <ErrorMessages messages={messages} />

      {successModal && (
        <SuccessModal
          action={successModal.action}
          amount={successModal.amount}
          onAction={handleAction}
          setSuccessModal={setSuccessModal}
        />
      )}

      <main role="main" aria-label="Banking Application">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <p className="text-5xl font-bold text-gray-900 text-center mb-8">
              Welcome to AwesomeGIC Bank!
            </p>

            {currentAction === null && <Menu onAction={handleAction} />}

            {currentAction === "statement" && (
              <Statement
                transactions={transactions}
                onBack={() => setCurrentAction(null)}
              />
            )}

            {(currentAction === "deposit" || currentAction === "withdraw") && (
              <TransactionForm
                action={currentAction}
                amount={amount}
                onAmountChange={setAmount}
                onSubmit={handleTransaction}
                onCancel={() => setCurrentAction(null)}
              />
            )}

            <Balance balance={balance} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
