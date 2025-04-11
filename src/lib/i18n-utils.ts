import fs from 'fs';
import path from 'path';

/**
 * Tự động tìm tất cả các namespace từ thư mục locales
 * @returns Danh sách các namespace
 */
export function getAvailableNamespaces(): string[] {
  try {
    // Đường dẫn đến thư mục locales
    const localesDir = path.join(process.cwd(), 'locales');
    
    // Lấy thư mục ngôn ngữ đầu tiên (thường là 'en')
    const firstLocaleDir = fs.readdirSync(localesDir)[0];
    const firstLocalePath = path.join(localesDir, firstLocaleDir);
    
    // Lấy tất cả các file JSON trong thư mục ngôn ngữ đầu tiên
    const files = fs.readdirSync(firstLocalePath);
    
    // Lọc ra các file JSON và lấy tên file (không có phần mở rộng)
    const namespaces = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    
    return namespaces;
  } catch (error) {
    console.error('Error getting available namespaces:', error);
    // Trả về một mảng mặc định nếu có lỗi
    return ['landing', 'navbar-general', 'footer-general'];
  }
}
