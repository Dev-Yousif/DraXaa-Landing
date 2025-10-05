# Admin Dashboard Setup Guide

This project includes a complete admin dashboard with authentication using Prisma, MongoDB, and NextAuth.js.

## 📋 Prerequisites

- MongoDB database (local or MongoDB Atlas)
- Node.js installed
- npm or yarn package manager

## 🚀 Setup Instructions

### 1. Configure Environment Variables

Update the `.env` file with your MongoDB connection string:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
```

**Important:** Generate a secure secret for production:
```bash
openssl rand -base64 32
```

### 2. Initialize Prisma

Generate the Prisma Client:

```bash
npm run prisma:generate
```

### 3. Push Database Schema

Push the schema to your MongoDB database:

```bash
npm run prisma:push
```

### 4. Seed the Database

Create the initial admin user:

```bash
npm run prisma:seed
```

This will create an admin user with:
- **Email:** admin@example.com
- **Password:** admin123

**⚠️ Change this password after first login in production!**

### 5. Start Development Server

```bash
npm run dev
```

## 🔐 Access the Dashboard

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with the seeded credentials
3. You'll be redirected to: `http://localhost:3000/admin/dashboard`

## 📁 Project Structure

```
app/
├── admin/
│   ├── dashboard/
│   │   └── page.jsx          # Main dashboard page
│   └── login/
│       └── page.jsx           # Login page
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.js        # NextAuth configuration

layouts/
└── components/
    ├── DashboardLayout.jsx     # Dashboard layout wrapper
    └── StatsCard.jsx          # Stats card component

lib/
└── prisma.js                  # Prisma client singleton

prisma/
├── schema.prisma              # Database schema
└── seed.js                    # Database seeding script
```

## 🛠️ Available Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:seed` - Seed database with initial data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 🔧 Features

### Authentication
- Secure password hashing with bcrypt
- JWT-based session management
- Protected routes with NextAuth
- Automatic redirect for authenticated/unauthenticated users

### Dashboard
- Modern, responsive UI with Tailwind CSS
- Statistics cards with trend indicators
- Recent activity feed
- Quick actions panel
- System status monitoring
- Sidebar navigation
- User profile section

### Database
- MongoDB with Prisma ORM
- Type-safe database queries
- Automatic migrations
- User model with email/password authentication

## 🔒 Security Best Practices

1. **Change default credentials** immediately in production
2. **Use strong passwords** for all admin accounts
3. **Keep NEXTAUTH_SECRET secure** and never commit to version control
4. **Use HTTPS** in production
5. **Enable MongoDB authentication** and use strong connection strings
6. **Regularly update dependencies** for security patches

## 📝 Adding New Admin Users

You can modify `prisma/seed.js` to add more users, or create an API route to register new admins programmatically.

## 🎨 Customization

### Styling
All components use Tailwind CSS classes. Modify the theme in `tailwind.config.js`.

### Navigation
Update the sidebar navigation in `layouts/components/DashboardLayout.jsx`.

### Stats
Modify the dashboard statistics in `app/admin/dashboard/page.jsx`.

## 🐛 Troubleshooting

### "Invalid credentials" error
- Verify your MongoDB connection string is correct
- Ensure the database was seeded properly
- Check that Prisma Client was generated

### Database connection issues
- Verify MongoDB is running (if local)
- Check network access settings in MongoDB Atlas
- Ensure IP whitelist is configured correctly

### NextAuth errors
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your development URL
- Clear browser cookies and try again

## 📚 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Authentication:** NextAuth.js v4
- **Database:** MongoDB
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Password Hashing:** bcryptjs
- **Session Management:** JWT

## 🚀 Production Deployment

Before deploying to production:

1. Update environment variables with production values
2. Generate a new NEXTAUTH_SECRET
3. Change default admin password
4. Enable MongoDB authentication
5. Configure proper CORS settings
6. Set up SSL/TLS certificates
7. Run `npm run build` to create optimized production build

## 📞 Support

For issues or questions, refer to the documentation:
- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Prisma Docs](https://www.prisma.io/docs)
