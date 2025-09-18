const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  pw: string;
  pw2: string;
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
}

export interface ResetPasswordRequest {
  email: string;
  username: string;
}

export interface ResetPasswordConfirmRequest {
  newPassword: string;
  newPassword2: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  biography?: string;
  interests?: string[];
  age?: number;
  gender?: string;
  sexualPreference?: string;
  location?: string;
  [key: string]: unknown;
}

export interface ApiResponse {
  msg: string;
}

class ApiService {
  async ping(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pubapi/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(data: LoginRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pubapi/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    if (result.msg) {
      localStorage.setItem('authToken', result.msg);
    }
    return result;
  }

  async register(data: RegisterRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pubapi/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async activate(token: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pubapi/activate/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Activation failed');
    }

    const result = await response.json();
    if (result.msg) {
      localStorage.setItem('authToken', result.msg);
    }
    return result;
  }

  async resetPasswordRequest(data: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pubapi/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }

    return response.json();
  }

  async resetPasswordConfirm(id: string, token: string, data: ResetPasswordConfirmRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/pubapi/reset-password/${id}/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    return response.json();
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<ApiResponse> {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}

const apiService = new ApiService();
export default apiService;
