type BalanceProps = {
  balance: number;
};

export default function Balance({ balance }: BalanceProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-8 pt-8 border-t border-gray-200"
    >
      <p className="text-sm text-gray-600">Current Balance</p>
      <p
        className="text-2xl font-semibold text-gray-900"
        aria-label={`Current balance is $${balance.toFixed(2)}`}
      >
        ${balance.toFixed(2)}
      </p>
    </div>
  );
}
