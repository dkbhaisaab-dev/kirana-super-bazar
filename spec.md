# Kirana Super Bazar - Online Daily Shopping

## Current State
New project with empty backend and no frontend.

## Requested Changes (Diff)

### Add
- Customer-facing online shop: browse products by category, search, add to cart, place orders
- Daily essentials product catalog: Grains, Spices, Dairy, Snacks, Beverages, Personal Care
- Shopping cart with quantity management and total calculation
- Order placement and order history for customers
- Admin panel: add/edit/delete products, view and manage orders, mark orders delivered
- Role-based access: admin vs customer
- Product model: id, name, nameHindi, category, price (per unit), unit (kg/litre/piece/pack), stock, imageUrl, description
- Order model: id, customer, items, total, status (pending/confirmed/out_for_delivery/delivered), timestamp, address

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Authorization component for login/roles
2. Blob storage for product images
3. Backend: CRUD for products, cart operations, order management, role checks
4. Frontend: Landing page, product browse/search, cart sidebar, checkout, order history, admin dashboard
