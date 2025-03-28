import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@lib/logger";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const ErrorCodes = {
  // Auth errors (1000-1999)
  UNAUTHORIZED: "AUTH_001",
  INVALID_CREDENTIALS: "AUTH_002",
  TOKEN_EXPIRED: "AUTH_003",
  EMAIL_EXISTS: "AUTH_004",

  // Product errors (2000-2999)
  PRODUCT_NOT_FOUND: "PROD_001",
  PRODUCT_OUT_OF_STOCK: "PROD_002",
  INVALID_PRODUCT_DATA: "PROD_003",

  // Order errors (3000-3999)
  ORDER_NOT_FOUND: "ORD_001",
  INVALID_ORDER_STATUS: "ORD_002",
  ORDER_CANNOT_BE_CANCELLED: "ORD_003",

  // Cart errors (4000-4999)
  CART_ITEM_NOT_FOUND: "CART_001",
  INVALID_QUANTITY: "CART_002",

  // Validation errors (5000-5999)
  VALIDATION_ERROR: "VAL_001",
  INVALID_INPUT: "VAL_002",

  // Server errors (9000-9999)
  INTERNAL_SERVER_ERROR: "SRV_001",
  SERVICE_UNAVAILABLE: "SRV_002",
} as const;

export function handleError(error: unknown) {
  logger.error("API Error:", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: {
          message: "Validation error",
          code: ErrorCodes.VALIDATION_ERROR,
          details: error.errors,
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      error: {
        message: "Internal server error",
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
      },
    },
    { status: 500 }
  );
} 