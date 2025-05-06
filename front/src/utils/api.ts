import crypto from 'crypto';

interface ApiResponse<T> {
  resultCode?: number;
  resultMessage?: string;
  data?: T;
  size?: number;
  action?: string;
  curdate?: string;
}

interface RequestHeaders extends Record<string, string> {
  'Content-Type'?: string;
  Authorization?: string;
}

export const sendRequest = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body: Record<string, any> | null = null,
  customHeaders: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: RequestHeaders = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
      cache: 'no-store' as RequestCache,
    };

    console.log('🔹 Sending request:', { url, method, headers: options.headers, body: options.body });

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || 'No additional info'}`);
    }

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    console.log('🔹 API Response Text:', responseText);

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid response: Server did not return JSON. Response: ${responseText}`);
    }

    const parsedResponse: ApiResponse<T> = JSON.parse(responseText);

    // resultCode шалгалтыг устгасан, учир нь энэ шалгалтыг login хуудсанд хийнэ
    return parsedResponse;
  } catch (error) {
    console.error('❌ API Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Сервертэй холбогдоход алдаа гарлаа';
    throw new Error(errorMessage);
  }
};

export const convertToMD5password = (password: string): string => {
  return crypto.createHash('md5').update(password).digest('hex');
};

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};