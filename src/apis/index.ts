// Define types
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
}

// product
//[GET] https://api.escuelajs.co/api/v1/products
export async function getProducts(): Promise<Product[]> {
  const response = await fetch('https://api.escuelajs.co/api/v1/products');
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/products/4
export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
  return response.json();
}

//[POST] https://api.escuelajs.co/api/v1/products/
export async function createProduct(product: Product): Promise<Product> {
  const response = await fetch('https://api.escuelajs.co/api/v1/products/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  return response.json();
}

//[PUT] https://api.escuelajs.co/api/v1/products/1
export async function updateProduct(id: number, product: Product): Promise<Product> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  return response.json();
}

//[DELETE] https://api.escuelajs.co/api/v1/products/1
export async function deleteProduct(id: number): Promise<Product> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/products?offset=0&limit=10
export async function getProductsPaginated(offset: number, limit: number): Promise<Product[]> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`);
  return response.json();
}

// category
//[GET] https://api.escuelajs.co/api/v1/categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetch('https://api.escuelajs.co/api/v1/categories');
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/categories/4
export async function getCategoryById(id: number): Promise<Category> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/categories/${id}`);
  return response.json();
}

//[POST] https://api.escuelajs.co/api/v1/categories/
export async function createCategory(category: Category): Promise<Category> {
  const response = await fetch('https://api.escuelajs.co/api/v1/categories/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  });
  return response.json();
}

//[PUT] https://api.escuelajs.co/api/v1/categories/1
export async function updateCategory(id: number, category: Category): Promise<Category> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category)
  });
  return response.json();
}

//[DELETE] https://api.escuelajs.co/api/v1/categories/1
export async function deleteCategory(id: number): Promise<Category> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/categories/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/categories?offset=0&limit=10
export async function getCategoriesPaginated(offset: number, limit: number): Promise<Category[]> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/categories?offset=${offset}&limit=${limit}`);
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/categories/1/products
export async function getCategoryProducts(id: number): Promise<Product[]> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/categories/${id}/products`);
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/categories/1/products?offset=0&limit=10
export async function getCategoryProductsPaginated(id: number, offset: number, limit: number): Promise<Product[]> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/categories/${id}/products?offset=${offset}&limit=${limit}`);
  return response.json();
}

// user
//[GET] https://api.escuelajs.co/api/v1/users
export async function getUsers(): Promise<User[]> {
  const response = await fetch('https://api.escuelajs.co/api/v1/users');
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/users/4 
export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`);
  return response.json();
}

//[POST] https://api.escuelajs.co/api/v1/users/
export async function createUser(user: User): Promise<User> {
  const response = await fetch('https://api.escuelajs.co/api/v1/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  return response.json();
}

//[PUT] https://api.escuelajs.co/api/v1/users/1
export async function updateUser(id: number, user: User): Promise<User> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  return response.json();
}

//[POST] https://api.escuelajs.co/api/v1/users/is-available
export async function checkUserAvailability(user: Partial<User>): Promise<{ isAvailable: boolean }> {
  const response = await fetch('https://api.escuelajs.co/api/v1/users/is-available', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  return response.json();
}

//[DELETE] https://api.escuelajs.co/api/v1/users/1
export async function deleteUser(id: number): Promise<User> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/users?offset=0&limit=10
export async function getUsersPaginated(offset: number, limit: number): Promise<User[]> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/users?offset=${offset}&limit=${limit}`);
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/users/1/orders
export async function getUserOrders(id: number): Promise<any[]> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}/orders`);
  return response.json();
}

//[GET] https://api.escuelajs.co/api/v1/users/1/orders?offset=0&limit=10
export async function getUserOrdersPaginated(id: number, offset: number, limit: number): Promise<any[]> {
  const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}/orders?offset=${offset}&limit=${limit}`);
  return response.json();
}