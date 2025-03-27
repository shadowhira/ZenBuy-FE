import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private requests: Map<string, number[]>;

  private constructor() {
    this.requests = new Map();
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  isRateLimited(ip: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Lấy danh sách request của IP
    let ipRequests = this.requests.get(ip) || [];

    // Lọc các request cũ
    ipRequests = ipRequests.filter(time => time > windowStart);

    // Kiểm tra số lượng request
    if (ipRequests.length >= config.max) {
      return true;
    }

    // Thêm request mới
    ipRequests.push(now);
    this.requests.set(ip, ipRequests);

    return false;
  }

  clear(ip: string) {
    this.requests.delete(ip);
  }
}

export const rateLimiter = RateLimiter.getInstance();

export function rateLimit(config: RateLimitConfig) {
  return function (request: NextRequest) {
    // Lấy IP từ headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'anonymous';

    if (rateLimiter.isRateLimited(ip, config)) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu, vui lòng thử lại sau" },
        { status: 429 }
      );
    }

    return NextResponse.next();
  };
} 