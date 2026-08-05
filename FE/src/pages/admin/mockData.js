export const initialDashboardStats = {
  totalRevenue: "45.2M ₫",
  revenueGrowth: "+12%",
  newOrders: 128,
  ordersGrowth: "+5%",
  productsSold: 342,
  productsGrowth: "+18%",
  newCustomers: 56,
  customersGrowth: "-2%"
};

export const revenueChartData = [
  { day: "Thứ 2", label: "T2", val: 12 },
  { day: "Thứ 3", label: "T3", val: 19 },
  { day: "Thứ 4", label: "T4", val: 15 },
  { day: "Thứ 5", label: "T5", val: 25 },
  { day: "Thứ 6", label: "T6", val: 22 },
  { day: "Thứ 7", label: "T7", val: 30 },
  { day: "Chủ Nhật", label: "CN", val: 28 }
];

export const topSellingProducts = [
  {
    id: 1,
    name: "Bóng Thi Đấu Nike Flight FIFA Quality Pro",
    sku: "SKU: BL-2024-P",
    sold: 124,
    image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Giày Đỉnh Tốc Độ Nike Mercurial Superfly 9",
    sku: "SKU: SH-X-GRN",
    sold: 89,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Găng Tay Thủ Môn Adidas Predator Pro",
    sku: "SKU: GL-ELT-B",
    sold: 56,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Áo Thi Đấu Real Madrid Sân Nhà 2024/25",
    sku: "SKU: TS-RM-H24",
    sold: 48,
    image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=120&auto=format&fit=crop&q=80"
  }
];

// Mock Orders matching BE Order.java & OrderItem.java entities
export const initialRecentOrders = [
  {
    orderId: 1,
    orderCode: "#ORD-9021",
    userId: "usr_101",
    firstName: "Bình",
    lastName: "Trần Văn",
    email: "binh.tv@gmail.com",
    phone: "0912 345 678",
    province: "TP. Hồ Chí Minh",
    district: "Quận 7",
    ward: "Phường Tân Phong",
    street: "123 Nguyễn Thị Thập",
    paymentMethod: "COD", // COD, MOMO, BANK_TRANSFER
    paymentStatus: "Đã thanh toán", // PAID, UNPAID, PENDING
    orderStatus: "Đã giao", // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    subtotal: "1,100,000 ₫",
    shippingFee: "30,000 ₫",
    discountAmount: "0 ₫",
    totalAmount: "1,130,000 ₫",
    createdAt: "10/10/2023 14:30",
    badgeType: "success",
    items: [
      { orderItemId: 1, productName: "Áo Thi Đấu Arsenal Sân Nhà 2024/25", skuVariant: "TS-ARS-H24-L", color: "Đỏ / Trắng", size: "L", quantity: 1, price: "950,000 ₫" },
      { orderItemId: 2, productName: "Tất Đá Bóng Chống Trượt Fox", skuVariant: "ACC-FOX-SOX", color: "Trắng", size: "Freesize", quantity: 2, price: "150,000 ₫" }
    ]
  },
  {
    orderId: 2,
    orderCode: "#ORD-9022",
    userId: "usr_102",
    firstName: "Hoa",
    lastName: "Lê Thị",
    email: "hoa.lt@gmail.com",
    phone: "0987 654 321",
    province: "Hà Nội",
    district: "Quận Cầu Giấy",
    ward: "Phường Dịch Vọng",
    street: "45 Xuân Thủy",
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "Chờ xác nhận",
    orderStatus: "Đang xử lý",
    subtotal: "3,400,000 ₫",
    shippingFee: "0 ₫",
    discountAmount: "0 ₫",
    totalAmount: "3,400,000 ₫",
    createdAt: "10/10/2023 15:45",
    badgeType: "warning",
    items: [
      { orderItemId: 3, productName: "Giày Đá Bóng Adidas Predator Accuracy.1 FG", skuVariant: "AD-PRED-ACC-42", color: "Đen / Đỏ", size: "42", quantity: 1, price: "3,400,000 ₫" }
    ]
  },
  {
    orderId: 3,
    orderCode: "#ORD-9023",
    userId: "usr_103",
    firstName: "Tuấn",
    lastName: "Phạm Minh",
    email: "tuan.pm@gmail.com",
    phone: "0903 112 233",
    province: "Đà Nẵng",
    district: "Quận Hải Châu",
    ward: "Phường Thạch Thang",
    street: "88 Trần Phú",
    paymentMethod: "MOMO",
    paymentStatus: "Chưa thanh toán",
    orderStatus: "Đã hủy",
    subtotal: "850,000 ₫",
    shippingFee: "35,000 ₫",
    discountAmount: "35,000 ₫",
    totalAmount: "850,000 ₫",
    createdAt: "10/10/2023 16:10",
    badgeType: "danger",
    items: [
      { orderItemId: 4, productName: "Bảo Vệ Ống Chân Nike Charge", skuVariant: "ACC-NK-GRD-M", color: "Đen", size: "M", quantity: 1, price: "450,000 ₫" },
      { orderItemId: 5, productName: "Túi Đựng Giày Thể Thao Puma", skuVariant: "BAG-PM-SH-01", color: "Đen", size: "Freesize", quantity: 1, price: "400,000 ₫" }
    ]
  },
  {
    orderId: 4,
    orderCode: "#ORD-9024",
    userId: "usr_104",
    firstName: "An",
    lastName: "Nguyễn Văn",
    email: "an.nv@gmail.com",
    phone: "0938 888 999",
    province: "TP. Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    ward: "Phường 25",
    street: "12D Điện Biên Phủ",
    paymentMethod: "MOMO",
    paymentStatus: "Đã thanh toán",
    orderStatus: "Đang giao hàng",
    subtotal: "2,450,000 ₫",
    shippingFee: "0 ₫",
    discountAmount: "0 ₫",
    totalAmount: "2,450,000 ₫",
    createdAt: "11/10/2023 09:15",
    badgeType: "info",
    items: [
      { orderItemId: 6, productName: "Giày Đá Bóng Mizuno Morelia Neo III", skuVariant: "MZ-NEO-3-WHT-41", color: "Trắng / Đỏ", size: "41", quantity: 1, price: "2,450,000 ₫" }
    ]
  }
];

export const initialUsersList = [
  {
    id: 1,
    name: "Nguyễn Văn Trường",
    email: "truong.nv@thepitch.vn",
    phone: "0901 234 567",
    role: "Quản trị viên",
    roleType: "admin",
    lastLogin: "Hôm nay, 08:30",
    initials: "NT",
    color: "#1e293b"
  },
  {
    id: 2,
    name: "Lê Thị Mai",
    email: "mai.lt@thepitch.vn",
    phone: "0987 654 321",
    role: "Quản lý cửa hàng",
    roleType: "manager",
    lastLogin: "Hôm qua, 17:45",
    initials: "LM",
    color: "#f5a623"
  },
  {
    id: 3,
    name: "Trần Văn Hùng",
    email: "hung.tv@thepitch.vn",
    phone: "0912 345 678",
    role: "Nhân viên Kho",
    roleType: "inventory",
    lastLogin: "12/10/2023",
    initials: "TH",
    color: "#0284c7"
  }
];

export const initialCustomersList = [
  {
    id: 101,
    name: "Trần Văn Bình",
    email: "binh.tv@gmail.com",
    phone: "0912 345 678",
    role: "Khách hàng thân thiết",
    ordersCount: 12,
    totalSpent: "14,500,000 ₫",
    lastLogin: "10/10/2023",
    initials: "TB",
    color: "#8b5cf6"
  }
];

export const initialProductsCatalog = [
  {
    id: 1,
    name: "Nike Mercurial Superfly 9 Academy",
    category: "Giày đá bóng",
    brand: "Nike",
    price: "2,490,000 ₫",
    stock: 24,
    status: "Đang bán",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80"
  }
];
