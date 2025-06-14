// src/components/auth/ResetPassword.tsx

export const ResetPassword: React.FC<{ token: string; onSuccess: () => void }> = ({ 
  token, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validatePassword(formData.password)) return;
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword(token, formData.password);
      onSuccess();
    } catch (error) {
      setErrors({ general: 'Invalid or expired reset token' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h1>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
