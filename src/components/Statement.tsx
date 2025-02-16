import { format } from "date-fns";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Transaction } from "../types";

type StatementProps = {
  transactions: Transaction[];
  onBack: () => void;
};

export default function Statement({ transactions, onBack }: StatementProps) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Account Statement
      </h2>
      {transactions.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 max-w-[85vw]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(transaction.date, "dd MMM yyyy hh:mm:ssaa")}
                    </td>
                    <td
                      className={clsx(
                        "px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right",
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {transaction.amount < 0 ? "-" : ""}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ${transaction.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        onClick={onBack}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 hover:bg-indigo-700"
      >
        Back to Menu
      </button>
    </div>
  );
}
