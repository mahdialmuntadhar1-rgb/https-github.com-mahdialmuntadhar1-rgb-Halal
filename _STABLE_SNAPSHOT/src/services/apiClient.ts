export const apiClient = {
  baseUrl: "",

  async request(path, options = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  },

  get(path) {
    return this.request(path, { method: "GET" });
  },

  post(path, body) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  put(path, body) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(body)
    });
  },

  delete(path) {
    return this.request(path, { method: "DELETE" });
  }
};
