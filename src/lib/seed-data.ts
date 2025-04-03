import bcrypt from 'bcryptjs';
import User, { IUser } from '@/models/User';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import dbConnect from './mongodb';

export async function seedUsers() {
  console.log('Seeding users...');
  
  // Xóa tất cả users hiện có
  await User.deleteMany({});
  
  // Tạo mật khẩu hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  // Tạo users mẫu
  const users = [
    {
      name: 'John Doe',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'customer',
      avatar: '/avatars/user1.jpg',
    },
    {
      name: 'Jane Smith',
      email: 'seller@example.com',
      password: hashedPassword,
      role: 'seller',
      avatar: '/avatars/user2.jpg',
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      avatar: '/avatars/admin.jpg',
    },
  ];
  
  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} users created`);
  
  return createdUsers;
}

export async function seedShops(users: IUser[]) {
  console.log('Seeding shops...');
  
  // Xóa tất cả shops hiện có
  await Shop.deleteMany({});
  
  // Tìm user với role là seller
  const seller = users.find(user => user.role === 'seller');
  
  if (!seller) {
    throw new Error('No seller user found');
  }
  
  // Tạo shop mẫu
  const shops = [
    {
      name: 'Tech Haven',
      slug: 'tech-haven',
      description: 'Your one-stop shop for all things tech',
      logo: '/shops/tech-haven-logo.jpg',
      banner: '/shops/tech-haven-banner.jpg',
      owner: seller._id,
      followers: 1200,
      rating: 4.8,
    },
  ];
  
  const createdShops = await Shop.insertMany(shops);
  console.log(`${createdShops.length} shops created`);
  
  return createdShops;
}

export async function seedCategories() {
  console.log('Seeding categories...');
  
  // Xóa tất cả categories hiện có
  await Category.deleteMany({});
  
  // Tạo categories mẫu
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      image: '/categories/electronics.jpg',
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      image: '/categories/clothing.jpg',
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Products for your home and garden',
      image: '/categories/home-garden.jpg',
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'Sports equipment and accessories',
      image: '/categories/sports.jpg',
    },
    {
      name: 'Books',
      slug: 'books',
      description: 'Books and literature',
      image: '/categories/books.jpg',
    },
  ];
  
  const createdCategories = await Category.insertMany(categories);
  console.log(`${createdCategories.length} categories created`);
  
  return createdCategories;
}

export async function seedProducts(shops: any[], categories: any[]) {
  console.log('Seeding products...');
  
  // Xóa tất cả products hiện có
  await Product.deleteMany({});
  
  // Lấy shop đầu tiên
  const shop = shops[0];
  
  // Tạo products mẫu
  const products = [];
  
  // Tạo 5 sản phẩm cho mỗi danh mục
  for (const category of categories) {
    for (let i = 1; i <= 5; i++) {
      const isFeatured = i <= 2; // 2 sản phẩm đầu tiên của mỗi danh mục sẽ là featured
      
      products.push({
        title: `${category.name} Product ${i}`,
        slug: `${category.slug}-product-${i}`,
        description: `This is a detailed description for ${category.name} Product ${i}. It includes information about the product features, specifications, and usage.`,
        price: Math.floor(Math.random() * 100) + 10,
        discountPrice: i % 3 === 0 ? Math.floor(Math.random() * 50) + 5 : undefined, // Giảm giá cho 1/3 sản phẩm
        stock: Math.floor(Math.random() * 100) + 10,
        images: [
          `/products/${category.slug}-${i}-1.jpg`,
          `/products/${category.slug}-${i}-2.jpg`,
          `/products/${category.slug}-${i}-3.jpg`,
        ],
        category: category._id,
        shop: shop._id,
        rating: Math.floor(Math.random() * 5) + 1,
        reviews: Math.floor(Math.random() * 100),
        featured: isFeatured,
      });
    }
  }
  
  const createdProducts = await Product.insertMany(products);
  console.log(`${createdProducts.length} products created`);
  
  return createdProducts;
}

export async function seedDatabase() {
  try {
    await dbConnect();
    
    const users = await seedUsers();
    const shops = await seedShops(users);
    const categories = await seedCategories();
    const products = await seedProducts(shops, categories);
    
    console.log('Database seeded successfully');
    
    return {
      success: true,
      message: 'Database seeded successfully',
      stats: {
        users: users.length,
        shops: shops.length,
        categories: categories.length,
        products: products.length,
      },
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
