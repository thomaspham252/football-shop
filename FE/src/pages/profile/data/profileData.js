export const USER = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0901 234 567',
  accountType: 'Cá nhân / Thành viên',
  address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  joinDate: 'Tháng 8, 2023',
  avatar: null,
};

export const ORDERS = [
  {
    id: 'DH-99281', date: '14 Tháng 10, 2024', total: 3200000,
    status: 'transit', statusLabel: 'Đang giao',
    product: { name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Elite FG', qty: 1, note: 'Dự kiến giao: 16 Tháng 10', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80' },
  },
  {
    id: 'DH-99154', date: '02 Tháng 10, 2024', total: 6850000,
    status: 'delivered', statusLabel: 'Đã giao',
    product: { name: 'Giày Đá Bóng Adidas Predator Elite FG', qty: 2, extra: '1 sản phẩm khác', note: 'Đã thanh toán qua Visa', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=120&q=80' },
  },
  {
    id: 'DH-98876', date: '01 Tháng 9, 2024', total: 1800000,
    status: 'delivered', statusLabel: 'Đã giao',
    product: { name: 'Áo Đấu Nike Dri-FIT Academy 23', qty: 1, note: 'Đã thanh toán qua COD', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&q=80' },
  },
  {
    id: 'DH-98541', date: '20 Tháng 9, 2024', total: 1500000,
    status: 'cancelled', statusLabel: 'Đã hủy',
    product: { name: 'Bộ Trang Phục Tập Luyện Pro', qty: 1, note: 'Đơn hàng đã được hoàn tiền', image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=120&q=80' },
  },
];

export const WISHLIST = [
  { id: 1, name: 'Giày Đá Bóng Nike Mercurial Vapor 16 Elite FG', price: 5800000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
  { id: 2, name: 'Áo Đấu Nike Dri-FIT Academy 23', price: 650000, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&q=80' },
  { id: 3, name: 'Giày Đá Bóng Adidas Predator Elite FG', price: 5200000, image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=300&q=80' },
  { id: 4, name: 'Bóng Đá FIFA Quality Pro', price: 890000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80' },
];
