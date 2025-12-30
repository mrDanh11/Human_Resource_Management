interface MoneyDisplayProps {
  money: number;
}

export default function MoneyDisplay({ money }: MoneyDisplayProps) {
  return (
    <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 flex justify-between">
      <span className="text-green-700 font-medium">Số tiền nhận:</span>
      <span className="text-green-700 text-lg font-bold">
        {money.toLocaleString("vi-VN")} đ
      </span>
    </div>
  );
}
