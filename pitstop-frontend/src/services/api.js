const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in your environment");
}

const api = {
  async get(endpoint, token) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return handleResponse(response);
  },

  async post(endpoint, data, token) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async patch(endpoint, data, token) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(endpoint, token) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return handleResponse(response);
  },
};

async function handleResponse(response) {
  const contentType = response.headers.get("Content-Type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = typeof data === 'object'
      ? data.detail || data.message || JSON.stringify(data)
      : data;
    throw new Error(error || 'API request failed');
  }

  return data;
}

export default api;
