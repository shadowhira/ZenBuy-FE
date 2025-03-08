// Định nghĩa base URL cho API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000/api"

// Hàm helper để xử lý fetch request
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

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
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
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
      throw new Error(errorData.message || `API error: ${response.status}`)
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

