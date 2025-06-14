// src/components/profile/FameRatingBreakdown.tsx
export const FameRatingBreakdown: React.FC<{ factors: any; rating: number }> = ({ 
  factors, 
  rating 
}) => {
  const breakdown = [
    {
      label: 'Profile Completeness',
      score: factors.profileCompleteness,
      maxScore: 1,
      description: 'Complete bio, tags, and personal info'
    },
    {
      label: 'Photos',
      score: Math.min(factors.photosCount / 5, 1) * 0.8,
      maxScore: 0.8,
      description: 'Number of profile photos (up to 5)'
    },
    {
      label: 'Popularity',
      score: Math.min(factors.likesReceived / 50, 1) * 0.8,
      maxScore: 0.8,
      description: 'Likes received from other users'
    },
    {
      label: 'Engagement',
      score: factors.responseRate * 0.5,
      maxScore: 0.5,
      description: 'How actively you respond to messages'
    },
    {
      label: 'Activity',
      score: factors.activityLevel <= 1 ? 0.3 : factors.activityLevel <= 7 ? 0.2 : 0.1,
      maxScore: 0.3,
      description: 'Recent activity on the platform'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Fame Rating Breakdown</h3>
        <FameRatingDisplay rating={rating} showLabel showNumber size="lg" />
      </div>

      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-500">
                {item.score.toFixed(2)} / {item.maxScore}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(item.score / item.maxScore) * 100}%` }}
              />
            </div>
            
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-pink-50 rounded-lg">
        <h4 className="font-medium text-pink-800 mb-2">Tips to Improve Your Rating:</h4>
        <ul className="text-sm text-pink-700 space-y-1">
          {factors.profileCompleteness < 1 && (
            <li>• Complete your profile with bio and tags</li>
          )}
          {factors.photosCount < 5 && (
            <li>• Add more photos to your profile</li>
          )}
          {factors.responseRate < 0.7 && (
            <li>• Be more responsive to messages</li>
          )}
          {factors.activityLevel > 7 && (
            <li>• Stay active on the platform</li>
          )}
        </ul>
      </div>
    </div>
  );
};
