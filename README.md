# Muze Events - Event Ticketing Website

A premium event ticketing website inspired by Muze Hustle Sasa, built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

- **Event Discovery**: Browse and search events by category, location, and venue
- **Event Categories**: Nairobi Events, Coast Events, Featured Events, Upcoming Events
- **Individual Event Pages**: Detailed event information with multiple ticket categories
- **Booking System**: Complete booking flow with unique booking references
- **Email Notifications**: Admin and customer email notifications via Resend
- **Manual Payment Confirmation**: Admin dashboard for verifying and confirming payments
- **Secure Admin Dashboard**: Protected admin area for event and booking management
- **Responsive Design**: Mobile-first design that works on all devices

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- Resend API key (for email notifications)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/muze-events
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your-resend-api-key
ADMIN_EMAIL=admin@example.com
EMAIL_FROM=noreply@muze-events.com
BOOKING_REFERENCE_PREFIX=MUZ
```

3. Seed the database with sample events:
```bash
npm run seed
```

This will create:
- An admin user (email: admin@example.com, password: admin123)
- Sample events using the images in the public folder

## Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
musesite/
├── public/                 # Static assets (event images, logos)
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/          # API routes
│   │   │   ├── auth/     # NextAuth authentication
│   │   │   ├── events/   # Event CRUD operations
│   │   │   ├── bookings/ # Booking operations
│   │   │   └── admin/    # Admin-only endpoints
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── events/       # Event pages
│   │   ├── confirmation/ # Booking confirmation page
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Providers.tsx
│   ├── lib/              # Utility functions
│   │   ├── mongodb.ts    # MongoDB connection
│   │   ├── auth.ts       # NextAuth configuration
│   │   ├── email.ts      # Email functions
│   │   └── seed.ts       # Database seeding script
│   └── models/           # Mongoose models
│       ├── Event.ts
│       ├── Booking.ts
│       └── User.ts
├── .env.local           # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Admin Dashboard

Access the admin dashboard at `/admin/dashboard`

**Default Admin Credentials:**
- Email: admin@example.com
- Password: admin123

**Important:** Change the admin password after first login!

## Important Notes

### Payment System
This website does **NOT** implement M-Pesa STK Push or any automated payment integration. The booking system:
- Collects customer information including M-Pesa prompt number
- Generates unique booking references
- Sends email notifications to admin and customer
- Displays "PENDING PAYMENT" status
- Requires manual payment confirmation by the administrator

The actual payment prompt is handled separately outside this website.

### Security
- Never commit `.env.local` to version control
- Change the default admin password immediately
- Use strong NEXTAUTH_SECRET in production
- Enable HTTPS in production
- Implement rate limiting for booking submissions in production

### Email Configuration
To enable email notifications:
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add it to `.env.local` as `RESEND_API_KEY`
4. Set your admin email as `ADMIN_EMAIL`

## API Endpoints

### Public Endpoints
- `GET /api/events` - List all events (supports filtering)
- `GET /api/events/[slug]` - Get single event
- `POST /api/bookings` - Create booking

### Admin Endpoints (Requires authentication)
- `GET /api/admin/events` - List all events
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/[id]` - Update event
- `DELETE /api/admin/events/[id]` - Delete event
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/bookings/[id]` - Get single booking
- `PUT /api/admin/bookings/[id]` - Update booking (confirm/cancel)
- `GET /api/admin/stats` - Get dashboard statistics

## Database Models

### Event
- name, slug, description
- posterImage, date, time, venue, location
- category (Nairobi, Coast, Other)
- ticketCategories (name, price, quantity)
- featured, status

### Booking
- bookingReference (unique)
- customer information (name, phone, email, promptNumber)
- event information (eventId, eventName, eventDate, eventVenue)
- ticket information (category, quantity, price, total)
- paymentStatus, bookingStatus
- email notification status

### User
- name, email, password
- role (admin, customer)

## Customization

### Adding Events
Events can be added through the admin dashboard or by modifying the seed script.

### Changing Branding
- Update logo in `public/muze-logo.png`
- Update colors in `tailwind.config.ts`
- Update metadata in `src/app/layout.tsx`

### Email Templates
Email templates are in `src/lib/email.ts`. Customize the HTML to match your branding.

## Troubleshooting

### MongoDB Connection Error
Ensure MongoDB is running and the connection string in `.env.local` is correct.

### Email Not Sending
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for usage limits
- Verify EMAIL_FROM is a verified domain in Resend

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npx tsc --noEmit`
- Check for environment variable issues

## License

This project is for demonstration purposes.
