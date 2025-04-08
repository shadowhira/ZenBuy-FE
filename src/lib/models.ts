// Import tất cả các models để đảm bảo chúng được đăng ký
import User from '@/models/User';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Shop from '@/models/Shop';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import Review from '@/models/Review';

// Export tất cả các models
export {
  User,
  Product,
  Category,
  Shop,
  Cart,
  Order,
  Review
};

// Hàm helper để đảm bảo tất cả các models được đăng ký
export function ensureModelsRegistered() {
  // Không cần làm gì, chỉ cần import tất cả các models là đủ
  return {
    User,
    Product,
    Category,
    Shop,
    Cart,
    Order,
    Review
  };
}
