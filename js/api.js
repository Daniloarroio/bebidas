window.appApi = {
  async csrfToken() {
    const response = await fetch('/api/csrf', { credentials: 'same-origin' });
    if (!response.ok) throw new Error('Não foi possível validar esta solicitação.');
    return response.json();
  },

  async request(url, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const headers = new Headers(options.headers || {});
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const csrf = await this.csrfToken();
      headers.set(csrf.headerName, csrf.token);
    }
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const response = await fetch(url, { ...options, method, headers, credentials: 'same-origin' });
    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : null;
    return { ok: response.ok, status: response.status, body };
  }
};
