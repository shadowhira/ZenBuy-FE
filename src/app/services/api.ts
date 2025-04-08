// Định nghĩa base URL cho API
// Sử dụng URL tuyệt đối để tránh vấn đề với đường dẫn ngôn ngữ
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Hàm helper để xử lý fetch request
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Sử dụng URL tuyệt đối để tránh vấn đề với đường dẫn ngôn ngữ
  let url;

  // Nếu endpoint đã là URL đầy đủ, sử dụng trực tiếp
  if (endpoint.startsWith('http')) {
    url = endpoint;
  } else {
    // Đảm bảo endpoint luôn bắt đầu bằng /
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      // Luôn sử dụng URL tuyệt đối với API_BASE_URL
    // Điều này đảm bảo chúng ta không bị ảnh hưởng bởi đường dẫn ngôn ngữ
    // Sử dụng window.location.origin nếu đang ở client
    if (typeof window !== 'undefined') {
      url = `${window.location.origin}/api${formattedEndpoint}`;
    } else {
      url = `${API_BASE_URL}${formattedEndpoint}`;
    }
  }

  console.log('Fetching from URL:', url)

  // Mặc định method là GET và headers có Content-Type là application/json
  const defaultOptions: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  // Thêm token vào header nếu user đã đăng nhập
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (token) {
    console.log('Adding token to request:', token.substring(0, 10) + '...');
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    }
  } else {
    console.log('No token found in localStorage');
  }

  // Thêm token từ cookie nếu có
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    if (cookies['token'] && !token) {
      console.log('Adding token from cookie to request:', cookies['token'].substring(0, 10) + '...');
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Authorization: `Bearer ${cookies['token']}`,
      }
    }
  }

  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  // Chuyển đổi body thành JSON string nếu cần
  if (fetchOptions.body && typeof fetchOptions.body === "object") {
    fetchOptions.body = JSON.stringify(fetchOptions.body)
  }

  try {
    const response = await fetch(url, fetchOptions)

    // Kiểm tra nếu response không ok (status code không nằm trong khoảng 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`API error (${response.status}):`, errorData)
      throw new Error(errorData.message || errorData.error || `API error: ${response.status}`)
    }

    // Parse JSON response
    const data = await response.json()
    return data as T
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

export { fetchApi }

