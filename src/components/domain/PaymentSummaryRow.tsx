import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatMoney, paymentStatusLabel } from "@/lib/format";
import type { Payment } from "@/types/domain";

interface PaymentSummaryRowProps {
  payment: Payment;
}

export function PaymentSummaryRow({ payment }: PaymentSummaryRowProps) {
  return (
    <tr className="border-t border-zinc-100">
      <td className="px-4 py-3 text-sm font-semibold text-zinc-900">{payment.id}</td>
      <td className="px-4 py-3 text-sm text-zinc-700">{formatMoney(payment.amount)}</td>
      <td className="px-4 py-3 text-sm text-zinc-700">{formatDate(payment.dueDate)}</td>
      <td className="px-4 py-3 text-sm text-zinc-700 uppercase">{payment.method}</td>
      <td className="px-4 py-3"><StatusBadge status={payment.status} label={paymentStatusLabel(payment.status)} /></td>
    </tr>
  );
}
