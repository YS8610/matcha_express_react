// src/components/profile/ProfileActions.tsx
export const ProfileActions: React.FC<{
  profile: any;
  onLike: () => void;
  onUnlike: () => void;
  onBlock: () => void;
  onReport: () => void;
  currentUser: any;
}> = ({
  profile,
  onLike,
  onUnlike,
  onBlock,
  onReport,
  currentUser
}) => {
  const [showActions, setShowActions] = useState(false);

  const canLike = currentUser.photos && currentUser.photos.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
      >
        <MoreVertical size={20} />
      </button>

      {showActions && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          {profile.isLiked ? (
            <button
              onClick={() => {
                onUnlike();
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Unlike
            </button>
          ) : (
            <button
              onClick={() => {
                if (canLike) {
                  onLike();
                  setShowActions(false);
                } else {
                  alert('You need to add a profile picture before liking others');
                }
              }}
              className={`w-full px-4 py-2 text-left transition-colors ${
                canLike 
                  ? 'text-pink-600 hover:bg-pink-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Like Profile
            </button>
          )}
          
          <button
            onClick={() => {
              onReport();
              setShowActions(false);
            }}
            className="w-full px-4 py-2 text-left text-orange-600 hover:bg-orange-50 transition-colors"
          >
            Report User
          </button>
          
          <button
            onClick={() => {
              onBlock();
              setShowActions(false);
            }}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            Block User
          </button>
        </div>
      )}

      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};
