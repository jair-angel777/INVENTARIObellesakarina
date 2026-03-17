export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // 1. Obtener token del localStorage
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('bellesas_token') || '';
  }

  // 2. Preparar cabeceras
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 3. Realizar la petición original
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // 4. Interceptar error 401 No Autorizado
    if (response.status === 401) {
      console.warn("Sesión expirada o inválida. Redirigiendo al login...");
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bellesas_token');
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    console.error("Error en fetchWithAuth:", error);
    throw error;
  }
};
