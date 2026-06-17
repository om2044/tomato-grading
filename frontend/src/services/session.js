export function clearSession() {
  localStorage.removeItem("token");
}

export async function requireValidResponse(response, navigate) {
  if (response.status === 401) {
    clearSession();
    if (navigate) navigate("/login");
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || `Erreur HTTP: ${response.status}`);
  }

  return response;
}
