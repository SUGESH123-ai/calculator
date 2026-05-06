# StyleHub - E-Commerce Clothing Website

A complete e-commerce website built with HTML, CSS, JavaScript (Frontend), Supabase (Backend), and Razorpay (Payment).

## Project Structure

```
ecommerce/
├── index.html                 # Main HTML file
├── styles.css                 # CSS styles
├── app.js                      # Main JavaScript logic
├── supabase-config.js         # Supabase configuration
├── payment.js                  # Razorpay payment integration
├── supabase-schema.sql        # Database schema
└── README.md                   # This file
```

## Features

### Frontend (HTML, CSS, JavaScript)
- ✅ Responsive design (mobile-friendly)
- ✅ Product listing with dynamic loading
- ✅ Product details modal
- ✅ Shopping cart with add/remove/update functionality
- ✅ User authentication (Login/Register)
- ✅ Checkout page with form validation
- ✅ Modern UI with smooth animations

### Backend (Supabase)
- ✅ User authentication (Email/Password)
- ✅ Product database
- ✅ Orders management
- ✅ User profiles
- ✅ Row Level Security (RLS)
- ✅ Real-time database

### Payment (Razorpay)
- ✅ Payment gateway integration
- ✅ Test mode support
- ✅ Payment verification
- ✅ Order confirmation

## Setup Instructions

### Step 1: Frontend Setup

1. **Clone or Download Files**
   - Download all project files to your local machine

2. **Open in VS Code**
   - Open VS Code
   - Go to File > Open Folder
   - Select the `ecommerce` folder

3. **Install Live Server (optional)**
   - Install the "Live Server" extension in VS Code
   - Right-click on `index.html` → Open with Live Server

### Step 2: Backend Setup (Supabase)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up or login
   - Create a new project
   - Wait for project initialization

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy `Project URL`
   - Copy `anon public key`

3. **Update Configuration**
   - Open `supabase-config.js`
   - Replace `YOUR_SUPABASE_URL` with your Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your anon key
   - Save the file

4. **Setup Database**
   - Open Supabase Dashboard
   - Go to SQL Editor
   - Click "New Query"
   - Copy all code from `supabase-schema.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Wait for tables to be created

### Step 3: Payment Setup (Razorpay)

1. **Create Razorpay Account**
   - Go to [razorpay.com](https://razorpay.com)
   - Sign up with business details
   - Complete KYC verification

2. **Get Razorpay Keys**
   - Login to Razorpay Dashboard
   - Go to Settings → API Keys
   - Copy `Key ID`
   - Copy `Key Secret` (keep this secure, never share)

3. **Update Payment Configuration**
   - Open `payment.js`
   - Replace `YOUR_RAZORPAY_KEY_ID` with your Key ID
   - Save the file

4. **Enable Test Mode**
   - Use these test credentials in Razorpay test mode:
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits

## Usage

### For Users

1. **Browse Products**
   - Open `index.html` in browser
   - View featured products on home page
   - Click "View Details" for more info

2. **Add to Cart**
   - Click "Add to Cart" button
   - Quantity can be selected in product details
   - Cart count updates in navbar

3. **Shopping Cart**
   - Click cart icon in navbar
   - View all items
   - Update quantities or remove items
   - Click "Proceed to Checkout"

4. **Checkout & Payment**
   - Fill delivery details
   - Review order summary
   - Click "Pay with Razorpay"
   - Complete payment
   - Get order confirmation

5. **User Account**
   - Click "Login" button
   - Create new account or login
   - Account info saved for future orders

### Test Credentials

**For Testing Registration:**
- Any valid email
- Password: minimum 6 characters

**For Testing Payment:**
- Name: Test User
- Email: test@example.com
- Phone: 9876543210
- Address: Test Address
- Card: 4111 1111 1111 1111
- CVV: 123 (or any 3 digits)
- Expiry: Any future date

## API Endpoints Used

### Supabase Auth
- `auth.signUp()` - Register new user
- `auth.signInWithPassword()` - Login user
- `auth.signOut()` - Logout user
- `auth.getUser()` - Get current user

### Supabase Database
- `products` - Product listing
- `orders` - Order management
- `user_profiles` - User details

### Razorpay
- `Razorpay()` - Payment widget
- `rzp.open()` - Open payment modal
- `rzp.on('payment.failed')` - Handle failure

## Customization

### Change Colors
Edit `:root` variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    /* ... */
}
```

### Add More Products
Insert in Supabase SQL Editor:
```sql
INSERT INTO products (name, category, description, price, image, stock) 
VALUES ('Product Name', 'Category', 'Description', 999, 'image_url', 50);
```

### Customize Navbar
Edit HTML in `index.html` line 7-20

### Change Images
Replace placeholder image URLs with real product images

## Security Notes

⚠️ **Important:**
- Never share your Razorpay Key Secret
- Never expose your Supabase DB password
- Always use HTTPS in production
- Implement server-side payment verification
- Keep sensitive keys in environment variables

## Deployment

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

### Deploy Backend to Supabase
- Already hosted automatically

## Troubleshooting

### Products Not Loading
- Check Supabase URL and Key in `supabase-config.js`
- Verify database tables exist in Supabase

### Login Not Working
- Confirm tables created from SQL schema
- Check email format in login form

### Payment Not Working
- Verify Razorpay Key ID is correct
- Check test mode is enabled
- Use correct test card numbers

### CORS Issues
- Enable CORS in Supabase project
- Or use Supabase proxy

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Razorpay
- **Storage**: Browser LocalStorage

## Future Enhancements

- [ ] Product search and filters
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Multiple payment methods

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Check Razorpay documentation: https://razorpay.com/docs/
- Review browser console for errors

## License

This project is open source and available for educational purposes.

---

**Happy Coding! 🚀**