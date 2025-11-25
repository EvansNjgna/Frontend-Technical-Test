# Frontend-Development-Technical-Test

## Product Management App

A modern, responsive product management dashboard built with **Vue 3**, **Pinia**, and **Tailwind CSS**. This application demonstrates a complete CRUD workflow for product management using the public DummyJSON API.

> Built for the AlienSoft Frontend Technical Test

### Tech stack

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** for state management (auth + products)
- **Vue Router** for navigation and route guards
- **Tailwind CSS** for styling (primary color `#000080`)
- **Axios** for HTTP calls

### Project structure (key folders)

- `src/api` – Axios client and API helpers for auth/products
- `src/stores` – Pinia stores (`auth`, `products`)
- `src/router` – Router with protected routes and guest-only login
- `src/views` – Main pages (`LoginView`, `ProductsView`, `ProductDetailView`, `AddProductView`)
- `src/components` – Shared UI (`AppHeader`, `ProductTable`, `LoadingSpinner`, `ErrorMessage`)

### Setup & Development

#### Prerequisites
- **Node.js** (v16 or higher) and **npm**

#### Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Frontend-Technical-Test-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will launch on the default Vite port (e.g., `http://localhost:5173`).

### Authentication

- Uses `POST https://dummyjson.com/auth/login` endpoint
- On success, the app stores:
  - `accessToken` (as `auth.token` in `localStorage`)
  - `refreshToken` (optional)
  - Basic user profile (name, username, email, avatar)
- Session is restored on refresh via the auth Pinia store
- **Test credentials:**
  - **Username:** `emilys`
  - **Password:** `emilyspass`

### Features

- **Login page (`/login`)**

  - Centered form with username/password
  - Shows clear validation and API error messages
  - On success: saves auth state and redirects to `/products`
  - Route guard prevents logged-in users from revisiting `/login`

- **Products list (`/products`)**

  - Loads products via Pinia store (`GET /products?limit=0`)
  - Search by title, optional filters:
    - Category dropdown (from `GET /products/categories`)
    - Min/Max price
  - Table shows:
    - Circular thumbnail
    - Title + truncated description
    - Category, price, stock
  - Row click navigates to product details
  - "Add new product" button → `/products/new`

- **View product (`/products/:id`)**

  - Fetches a single product via store (`GET /products/{id}`) or uses cached list item
  - Shows large image, full description, category, price, stock, rating, discount
  - Back to products, Edit (inline quick edit), and Delete actions
  - Delete:
    - Confirms with user
    - Calls `DELETE /products/{id}`
    - Updates store and redirects to `/products`

- **Add product (`/products/new`)**
  - Form fields:
    - Title (required)
    - Description
    - Category (dropdown)
    - Price
    - Stock
    - Thumbnail URL
  - Basic validation and error messaging
  - On submit:
    - Calls `POST /products/add`
    - Adds created product to store
    - Redirects to product details (or list as fallback)

### Styling & UX

- **Color Scheme:** Tailwind CSS with primary color `#000080` applied to:
  - Buttons, links, headers, and key UI accents
- **Design Features:**
  - Clean table with hover states, rounded corners, and subtle shadows
  - Responsive layout optimized for laptop and tablet widths
  - Consistent spacing and typography
- **User Experience:**
  - Global `LoadingSpinner` component for async operations
  - `ErrorMessage` component for clear API and form error feedback
  - Smooth transitions and intuitive navigation flow

### GitHub Pages deployment

1. Install deployment dependency:

```bash
npm install --save-dev gh-pages
```

2. Ensure `vite.config.js` has the correct `base` for your repo:

```js
// vite.config.js
export default defineConfig({
  plugins: [vue()],
  base: "/technical-frontend/", // change to '/<your-repo-name>/' if needed
});
```

3. Add deploy scripts to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Build and deploy:

```bash
npm run build
npm run deploy
```

GitHub Pages will serve the app from `https://<your-username>.github.io/<your-repo-name>/`.
