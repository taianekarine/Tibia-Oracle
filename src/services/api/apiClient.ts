export async function apiRequest<T>(
  method: HttpMethod,
  url: string,
  options?: ApiOptions
): Promise<T>
