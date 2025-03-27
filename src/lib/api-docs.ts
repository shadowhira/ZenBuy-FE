import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const registry = new OpenAPIRegistry();

// Auth schemas
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

// Product schemas
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  images: z.array(z.string()),
  rating: z.number(),
  reviews: z.number(),
  stock: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Order schemas
const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    price: z.number(),
  })),
  totalAmount: z.number(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Register schemas
registry.register('Login', LoginSchema);
registry.register('Register', RegisterSchema);
registry.register('Product', ProductSchema);
registry.register('Order', OrderSchema);

// Register endpoints
registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: z.object({
            user: z.object({
              id: z.string(),
              email: z.string(),
              name: z.string(),
              role: z.enum(['customer', 'seller']),
            }),
            token: z.string(),
          }),
        },
      },
    },
    401: {
      description: 'Invalid credentials',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RegisterSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Registration successful',
      content: {
        'application/json': {
          schema: z.object({
            user: z.object({
              id: z.string(),
              email: z.string(),
              name: z.string(),
              role: z.enum(['customer', 'seller']),
            }),
            token: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Email already exists',
    },
  },
});

export const apiDocs = registry.definitions; 