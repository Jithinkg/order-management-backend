const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  RESTAURANT_OWNER: 'restaurant_owner',
  DELIVERY_AGENT: 'delivery_agent',
  ADMIN: 'admin',
});

const PERMISSIONS = Object.freeze({
  CREATE_PRODUCT: 'create_product',
  EDIT_PRODUCT: 'edit_product',
  DELETE_PRODUCT: 'delete_product',
  VIEW_ALL_ORDERS: 'view_all_orders',
  UPDATE_ORDER_STATUS: 'update_order_status',
  MANAGE_USERS: 'manage_users',
  VIEW_ANALYTICS: 'view_analytics',
});

const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.CUSTOMER]: [],
  [ROLES.RESTAURANT_OWNER]: [
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.UPDATE_ORDER_STATUS,
  ],
  [ROLES.DELIVERY_AGENT]: [
    PERMISSIONS.UPDATE_ORDER_STATUS,
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
});

module.exports = { ROLES, PERMISSIONS, ROLE_PERMISSIONS };
