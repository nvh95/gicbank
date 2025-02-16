import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  DocumentTextIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { Action } from "../types";

type MenuProps = {
  onAction: (action: Action) => void;
};

export default function Menu({ onAction }: MenuProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        What would you like to do?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onAction("deposit")}
          className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-green-600 hover:bg-green-700"
        >
          <ArrowUpCircleIcon className="h-5 w-5 mr-2" />
          Deposit
        </button>
        <button
          onClick={() => onAction("withdraw")}
          className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700"
        >
          <ArrowDownCircleIcon className="h-5 w-5 mr-2" />
          Withdraw
        </button>
        <button
          onClick={() => onAction("statement")}
          className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700"
        >
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Print Statement
        </button>
        <button
          onClick={() => onAction("quit")}
          className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700"
        >
          <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
          Quit
        </button>
      </div>
    </div>
  );
}
