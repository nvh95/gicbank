type TransactionFormProps = {
  action: string;
  amount: string;
  onAmountChange: (amount: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function TransactionForm({
  action,
  amount,
  onAmountChange,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  return (
    <form onSubmit={onSubmit} aria-label={`${action} form`}>
      <div className="space-y-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Please enter the amount to {action}:
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
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-6 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
            aria-label={`Enter amount to ${action}`}
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
            onClick={onCancel}
            className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
