// src/components/profile/LikesPage.tsx
export const LikesPage: React.FC<VisitorsPageProps> = ({ onBack, onViewProfile }) => {
  const [likes, setLikes] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mutual' | 'pending'>('all');

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      setIsLoading(true);
      const likesData = await api.getProfileLikes();
      setLikes(likesData);
    } catch (error) {
      console.error('Failed to load likes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredLikes = () => {
    return likes.filter(like => {
      switch (filter) {
        case 'mutual':
          return like.isMatched;
        case 'pending':
          return !like.isMatched;
        default:
          return true;
      }
    });
  };

  const handleLikeBack = async (profileId: number) => {
    try {
      await api.likeProfile(profileId);
      setLikes(prev => prev.map(like => 
        like.id === profileId 
          ? { ...like, isMatched: true }
          : like
      ));
    } catch (error) {
      console.error('Failed to like back:', error);
    }
  };

  const filteredLikes = getFilteredLikes();
  const mutualLikes = likes.filter(like => like.isMatched).length;
  const pendingLikes = likes.filter(like => !like.isMatched).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">People Who Liked You</h1>
            <p className="text-sm text-gray-600">{likes.length} total likes</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-4 border-b">
            <div className="flex space-x-2">
              {[
                { key: 'all', label: `All (${likes.length})` },
                { key: 'mutual', label: `Matches (${mutualLikes})` },
                { key: 'pending', label: `New (${pendingLikes})` }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredLikes.length === 0 ? (
          <div className="text-center py-12">
            <Eye size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {filter === 'all' ? 'No likes yet' : `No ${filter} likes`}
            </h3>
            <p className="text-gray-500">
              Keep improving your profile to get more likes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredLikes.map((like) => (
              <div
                key={like.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={like.photos[0]}
                    alt={like.name}
                    className="w-full h-48 object-cover"
                  />
                  {like.isOnline && (
                    <div className="absolute top-3 right-3 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  )}
                  {like.isMatched && (
                    <div className="absolute top-3 left-3 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Match!
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {like.name}, {like.age}
                    </h3>
                    <FameRatingDisplay rating={like.fameRating} size="sm" />
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin size={14} className="mr-1" />
                    {like.distance}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {like.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewProfile(like.id)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      View Profile
                    </button>
                    
                    {!like.isMatched && (
                      <button
                        onClick={() => handleLikeBack(like.id)}
                        className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                      >
                        Like Back
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
