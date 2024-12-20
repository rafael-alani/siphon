import { StatusBadgeProps } from "../types/energy";

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    surplus: 'bg-green-100 text-green-800',
    deficit: 'bg-red-100 text-red-800',
    balanced: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status.toLowerCase() as keyof typeof styles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}