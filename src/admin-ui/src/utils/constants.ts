export const ORDER_STATUS = {
  pending: {
    label: 'Pending',
    color: 'yellow'
  },
  processing: {
    label: 'Processing',
    color: 'blue'
  },
  shipping: {
    label: 'Shipping',
    color: 'indigo'
  },
  delivered: {
    label: 'Delivered',
    color: 'green'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red'
  }
} as const;
export const PAYMENT_STATUS = {
  pending: {
    label: 'Pending',
    color: 'yellow'
  },
  paid: {
    label: 'Paid',
    color: 'green'
  },
  refunded: {
    label: 'Refunded',
    color: 'gray'
  }
} as const;
export const USER_ROLES = {
  admin: {
    label: 'Admin',
    color: 'purple'
  },
  user: {
    label: 'User',
    color: 'blue'
  },
  seller: {
    label: 'Seller',
    color: 'green'
  }
} as const;
export const PRODUCT_STATUS = {
  active: {
    label: 'Active',
    color: 'green'
  },
  inactive: {
    label: 'Inactive',
    color: 'gray'
  },
  out_of_stock: {
    label: 'Out of Stock',
    color: 'red'
  }
} as const;
export const SELLER_STATUS = {
  pending: {
    label: 'Pending',
    color: 'yellow'
  },
  approved: {
    label: 'Approved',
    color: 'green'
  },
  rejected: {
    label: 'Rejected',
    color: 'red'
  },
  suspended: {
    label: 'Suspended',
    color: 'gray'
  }
} as const;
export const ITEMS_PER_PAGE = 10;