import { useRef, useEffect } from "react";
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  DocumentTextIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { Action } from "../types";
import { SuccessModalType } from "../App";

type SuccessModalProps = {
  action: "deposit" | "withdraw";
  amount: number;
  onAction: (action: Action) => void;
  setSuccessModal: React.Dispatch<React.SetStateAction<SuccessModalType>>;
};

export default function SuccessModal({
  action,
  amount,
  onAction,
  setSuccessModal,
}: SuccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Enhance accessibility by focusing the modal when it opens
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleDeposit = () => {
    setSuccessModal(null);
    onAction("deposit");
  };

  const handleWithdraw = () => {
    setSuccessModal(null);
    onAction("withdraw");
  };

  const handleStatement = () => {
    setSuccessModal(null);
    onAction("statement");
  };

  const handleQuit = () => {
    setSuccessModal(null);
    onAction("quit");
  };

  return (
    <div
      data-testid="success-modal"
      className="fixed inset-0 flex items-center justify-center p-4"
    >
      <div
        data-testid="modal-backdrop"
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
            Thank you. ${amount.toFixed(2)} has been{" "}
            {action === "withdraw" ? "withdrawn" : "deposited"}.
          </p>
          <p className="text-gray-600">
            Is there anything else you'd like to do?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleDeposit}
            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-green-600 hover:bg-green-700"
          >
            <ArrowUpCircleIcon className="h-5 w-5 mr-2" />
            Deposit
          </button>
          <button
            onClick={handleWithdraw}
            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700"
          >
            <ArrowDownCircleIcon className="h-5 w-5 mr-2" />
            Withdraw
          </button>
          <button
            onClick={handleStatement}
            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Print Statement
          </button>
          <button
            onClick={handleQuit}
            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700"
          >
            <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}
