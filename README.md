# BookCourier

BookCourier is a **library delivery management system** where users can request book pickup or delivery from their nearby libraries. The system helps students, researchers, and readers borrow and return books **without physically visiting the library**.

---
## 🌐 Live Demo

- **Frontend (User Interface):** [BookCourier Live Site](https://bookscourier24.netlify.app)  
- **Backend (API Server):** [BookCourier Backend](https://bookscourier.vercel.app)  

---

## 🛠 Project Stack

### Frontend
- **React.js**
- **HTML**
- **Tailwind CSS**
- **DaisyUI**
- Fully responsive for all devices
- Custom alerts/modals using **SweetAlert2**
- Custom 404 error page
- Animations with **AOS**
- Loading spinner
- **React Icons**
- **React Router**
- **React-Leaflet**

### Authentication
- **Firebase Authentication (Email/Password)**
- **JWT (Firebase)**
> Note: Email verification exists but is not yet implemented.

### Backend
- **Express.js**
- **MongoDB**

### Payment Gateway
- **Stripe**

### Hosting
- **Netlify**

### Credits
- **Developer:** Md. Junaid Jewel

---

## 🎨 UI Frameworks & Libraries
- **UI Framework:** Tailwind CSS + DaisyUI
- **Animations:** AOS
- **Alerts:** SweetAlert2
- **Authentication:** Firebase

---

## 👥 User Roles

This project contains **three roles**:  

1. **User**
2. **Librarian**
3. **Admin**

---

## 📌 User Dashboard

### My Orders
- Users can see all their ordered books and their status in a table.
- Each row shows: Book title, order date, and buttons:
  - **Cancel** (if order is pending)
  - **Pay Now** (if order is pending)
- **Cancel Button:** Changes order status to "cancelled" and hides all buttons.
- **Pay Now Button:** Redirects to payment page; after successful payment, status becomes "paid" and button is hidden.

### My Profile
- Shows logged-in user's profile information.
- Form to update user name and profile image.

### Invoices
- Displays all payments made by the user.
- Shows Payment ID, Amount, Date, and optionally Book Name.

---

## 📌 Librarian Dashboard

### Add Book
- Add books via a form containing:
  - Book name, image, author, status (dropdown: published/unpublished), price, submit button.
- Unpublished books are hidden from "All Books" page.

### My Books
- Shows all books added by the librarian in a table.
- Each row shows book name, image, and **Edit** button.
- Books cannot be deleted but can be unpublished.
- Edit button opens a page to modify book details.

### Orders
- See all orders for books added by the librarian.
- Can **cancel orders**.
- Can update order status:
  - From **pending → shipped → delivered**
- Status can be changed via dropdown or other UI element.

---

## 📌 Admin Dashboard

### All Users
- Displays all registered users.
- Admin can **Make Librarian** or **Make Admin**.

### Manage Books
- Displays all books added by all librarians.
- Admin can:
  - Publish / Unpublish books
  - Delete books (deleting also removes associated orders)

### My Profile
- Same as User Dashboard's My Profile page.

---

## 🚀 Features Summary
- Fully responsive UI
- Custom alerts and modals
- Smooth animations (AOS)
- Firebase authentication with JWT
- Stripe payment integration
- Role-based dashboards (User, Librarian, Admin)
- CRUD operations for books and orders
- Real-time order tracking and status updates
- Hosted on Netlify

---
