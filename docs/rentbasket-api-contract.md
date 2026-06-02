# RentBasket Backend API Contract (test environment)

> Reference only — captured 2026-06-02. Base URL: `https://testapi.rentbasket.com`
> Sample product/catalog response shape lives in [`src/data/products-api-sample.json`](../src/data/products-api-sample.json).

## Auth

All endpoints below require a Bearer token obtained from the token endpoint.

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | POST | `/get-jwt-token` | Get the token and include it in the `Authorization` header as a Bearer token for every API below. |

**Payload (token):**
```
app_key: base64:/mIAk2D0P+xn5OHNwyvk1JjaR3uABCOmw5hBGxQGLTk=
```

## Catalog (read)

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 2 | GET | `/get-amenity-category` | Fetch all amenity categories (Furniture, Appliances, and other available categories). |
| 3 | GET | `/get-subcategories-by-category?category_id=1` | Fetch all subcategories for a given category ID. e.g. Furniture → Bed, Sofa, Chair, etc. |
| 4 | GET | `/get-amenity-types-by-subcategory?subcategory_id=1` | Fetch all amenity types for a given subcategory ID. e.g. Bed → Single Bed, Double Bed, Bed with Storage, Bed without Storage, etc. |

## Cart / Proposal (write)

The cart is server-side, keyed by `lead_id` + `user_id`. Items are "amenity types" added with a chosen `duration`, `count`, `rent`, and `security`.

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 5 | POST | `/add-to-proposal-for-lead` | Add the selected amenity type to the cart. |
| 6 | POST | `/update-proposal-cart` | Update cart (e.g. change count). |
| 7 | POST | `/remove-from-proposal-cart` | Remove from cart. |
| 8 | GET | `/get-proposal-cart-items-for-lead?lead_id=4339` | Get all cart items. |
| 9 | POST | `/confirm-proposal-for-tenant` | Confirm and create a proposal for all items in the cart. Step immediately before the payment process. |

**Payloads:**

```jsonc
// 5. add-to-proposal-for-lead
{ "user_id": "903000010001", "amenity_type_id": 28, "count": 1, "rent": 294, "duration": 12, "security": 588, "lead_id": "4339" }

// 6. update-proposal-cart
{ "user_id": "903000010001", "amenity_type_id": 28, "count": 2, "lead_id": "4339" }

// 7. remove-from-proposal-cart
{ "user_id": "903000010001", "amenity_type_id": 1089, "count": 0, "rent": 359.1, "duration": 6 }

// 9. confirm-proposal-for-tenant
{ "user_id": "903000010001", "cart_items": [ { "cart_item_id": 10465, "coupon_list": [] }, { "cart_item_id": 10467, "coupon_list": [] } ], "lead_id": "4339" }
```

## Confirmed live response — `get-proposal-cart-items-for-lead` (2026-06-02)

Verified against the production site (`qr.rentbasket.com`, lead 5383). Production hosts: `api2.rentbasket.com` (JWT), `api.rentbasket.com` (cart/catalog). Each cart item:

```jsonc
{
  "amenity_type_id": 17,
  "amenity_type_name": "Double Bed King Non-Storage Basic",
  "amenity_count": 1,            // quantity
  "duration": 6,                  // months (cart offers 3/6/9/12)
  "rent": 769,                    // list rent for the chosen duration (= rent_6)
  "rent_3": 979, "rent_6": 769, "rent_9": 728, "rent_12": 699,
  "percent_discount": 30,
  "rent_with_discount": 538,      // rent × (1 − percent_discount/100)
  "net_rent_with_discount": 538,  // after coupon (same here, no coupon)
  "security": 1538,               // = rent × security_multiple  (deposit, per unit)
  "security_multiple": 2,
  "adv_security": 1600,           // separate field (not the charged deposit here)
  "coupon_list": []
}
```
Top level: `cart_value` = Σ `net_rent_with_discount` (monthly base rent, pre-GST); `coupons`, `coupon_terms`, `customer_details`, `delivery_address`.

**Key takeaways for the build:** rent & security are **per unit** (×`amenity_count`); the **deposit is returned by the API** (`security` = list rent × `security_multiple`); GST (18%) and the first-month/50% totals are applied at proposal time (see the proposal bill).

## Notes / open questions
- `duration` in cart payloads is an integer (`12`, `6`) — matches the `rent_3/6/9/12` monthly tiers and `rent_01d/08d/15d/30d/60d` day tiers in the product sample. Need to confirm exact encoding for day-based durations.
- `rent` and `security` are sent from the client on add — confirm the server trusts these vs. recomputes them.
- `coupon_list` is per-cart-item (array) at confirm time — relevant to the cart→checkout coupon carry-through work.
- Where `lead_id` / `user_id` come from (login? lead capture?) is not yet defined for the public site.
