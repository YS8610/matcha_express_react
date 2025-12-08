interface LoadingSkeletonProps {
  count?: number;
  type?: 'grid' | 'list' | 'card';
  className?: string;
}

export default function LoadingSkeleton({
  count = 6,
  type = 'grid',
  className = ''
}: LoadingSkeletonProps) {
  const gridClasses = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  const listClasses = 'space-y-4';
  const cardClasses = 'grid grid-cols-1 gap-4';

  const containerClass = type === 'grid' ? gridClasses : type === 'list' ? listClasses : cardClasses;

  if (type === 'grid' || type === 'card') {
    return (
      <div className={`${containerClass} ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List type skeleton
  return (
    <div className={`${containerClass} ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg animate-pulse"
        >
          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
