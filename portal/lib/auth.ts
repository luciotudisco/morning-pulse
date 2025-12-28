/**
 * Check if user is authenticated by checking session cookie
 */
export async function checkAuth(): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const response = await fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

