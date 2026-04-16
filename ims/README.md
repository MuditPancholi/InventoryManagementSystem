# Inventory Management System (IMS)

A comprehensive web-based inventory management solution designed to streamline business operations with role-based access control, real-time inventory tracking, and analytics.

## Features

### User Roles & Authentication
- **Admin**: Full system control, user management, and configuration
- **Employees**: Access to inventory and transactions
- **Suppliers**: Manage product supply and orders
- User registration and login system
- Role-based permission management

### Core Functionality
- **Dashboard**: Role-specific dashboards for quick insights
- **Product Management**: Add, edit, and manage products
- **Inventory Tracking**: Real-time stock level monitoring
- **Low Stock Alerts**: Track products running out of inventory
- **Transactions**: Record and view all business transactions
- **Analytics & Reports**: Visualize data with charts and graphs
- **Supplier Management**: Manage supplier information and orders

## Project Structure

```
ims/
├── index.html                  # Landing page
├── login.html                  # User login
├── register.html               # User registration
├── admin-dashboard.html        # Admin dashboard
├── employee-dashboard.html     # Employee dashboard
├── supplier-dashboard.html     # Supplier dashboard
├── user-dashboard.html         # General user dashboard
├── products.html               # Product listing
├── manage-products.html        # Product management
├── inventory.html              # Inventory overview
├── add-item.html               # Add inventory items
├── low-stock.html              # Low stock alerts
├── no-stock.html               # Out of stock items
├── transactions.html           # Transaction history
├── analysis.html               # Analytics & reports
├── demo.html                   # Demo/preview page
├── script.js                   # Main JavaScript logic
├── style.css                   # Global styles
└── src/
    ├── dashboard.html          # Dashboard components
    ├── register.html           # Registration components
    └── styles/
        └── auth.css            # Authentication styles
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required (client-side storage with localStorage)

### Installation

1. Clone or download this repository
2. Navigate to the `ims` directory
3. Open `index.html` in your web browser

### Usage

1. **First Time Users**: Click "Register" to create an account and select your role
2. **Login**: Use your credentials to access the system
3. **Dashboard**: Navigate to your role-specific dashboard for relevant information
4. **Manage Inventory**: Use the inventory management pages to add/edit products
5. **View Reports**: Access analytics for business insights

## Key Pages & Functions

| Page | Purpose |
|------|---------|
| `index.html` | Landing page with role overview |
| `login.html` | Authentication entry point |
| `admin-dashboard.html` | System overview and user management |
| `employee-dashboard.html` | Employee tasks and inventory access |
| `products.html` | View all products in the system |
| `inventory.html` | Manage inventory levels |
| `analysis.html` | View analytics and reports |
| `transactions.html` | Track all business transactions |

## Data Storage

- User data and inventory information are stored in **localStorage**
- Data persists across browser sessions (in the same browser)
- No external database required for basic functionality

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Business logic and interactivity
- **Font Awesome** - Icons
- **Chart Library** - Data visualization (integrated in script.js)

## Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Features in Detail

### Admin Dashboard
- User management and approval
- System statistics and charts
- User role distribution
- Purchase trends analysis

### Employee Portal
- View current inventory
- Add/manage items
- Check low stock alerts
- View transaction history

### Supplier Portal
- Manage product listings
- Track orders
- Update stock information

### Analytics
- Revenue by category
- Stock level monitoring
- Top performing products
- Purchase trends over time

## Future Enhancements

- Backend integration with database
- Email notifications for low stock
- Advanced search and filtering
- Export reports to PDF/Excel
- Multi-language support
- Mobile app version

## Notes

- All data is client-side; clearing browser data will remove all information
- For production use, integrate with a backend server and database
- Ensure secure authentication and data validation on the backend

## License

This project is open source and available for educational and commercial use.

---

For questions or support, please refer to the documentation or contact the development team.
