interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        {icon}
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">{title}</p>
      {description && (
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-600 text-white py-2 px-6 rounded-lg hover:from-green-600 hover:to-green-700 dark:hover:from-green-800 dark:hover:to-green-700 transition-all duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
