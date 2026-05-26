# Wolf Pack Automotive Website

A professional automotive service website for Wolf Pack Automotive with vehicle submission form.

## Domain
**wolfpackautmotive.com**

## Project Structure

```
wolf pack automotive website/
├── index.html           # Homepage
├── form.html            # Vehicle submission form
├── services.html        # Services listing page
├── login.html           # Employee login page
├── admin.html           # Employee dashboard
├── css/
│   └── style.css        # All styling
├── js/
│   └── script.js        # Form handling and interactivity
└── README.md            # This file
```

## Pages

### 1. **index.html** - Homepage
- Welcome hero section
- Services preview
- Call-to-action for form submission
- Navigation to all pages

### 2. **form.html** - Vehicle Submission Form
Form fields for collecting:
- **Full Name** (required)
- **Phone Number** (required)
- **Year** (required)
- **Make** (required)
- **Model** (required)
- **License Plate** (required)
- **Email** (optional)
- **Additional Notes** (optional)

Data is saved to browser's localStorage and ready for backend integration.

### 3. **services.html** - Services Page
Detailed listing of automotive services including:
- General Maintenance
- RV Services
- Diagnostics

### 4. **login.html** - Master Admin Login
Master admin sign-in page for staff access and employee account management.

### 5. **admin.html** - Employee Dashboard
Protected admin page showing vehicle submissions stored in localStorage and employee account management for the master admin.

## Features

✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Professional Styling** - Wolf Pack Automotive branding
✅ **Form Validation** - Required fields enforced
✅ **Data Storage** - Submissions saved to localStorage
✅ **Success Feedback** - User confirmation after submission
✅ **Clean Navigation** - Easy access between pages

## Getting Started

1. **Open the website**: Simply open `index.html` in a web browser
2. **Navigate pages**: Use the navigation menu to browse
3. **Submit a form**: Fill out the vehicle form on the form.html page
4. **Employee login**: Visit `login.html` and sign in with your master admin credentials.
5. **View submissions** (Employee): After login, the dashboard displays customer submissions.
6. **Manage employees**: The master admin can add and remove employee accounts from `admin.html`.

## Current Features

- ✅ HTML/CSS/JavaScript frontend
- ✅ Form data saved to browser localStorage
- ✅ Responsive mobile design
- ✅ Professional branding

## Future Enhancements

### Backend Integration
When ready to add a backend server, uncomment and modify in `js/script.js`:

```javascript
// Uncomment the sendToBackend() call in the form submission handler
// Update the API endpoint to match your backend
// Example backend technologies:
// - Node.js + Express
// - Python + Flask/Django
// - PHP
// - Firebase/Supabase
```

### Suggested Backend Features
1. Email notifications when forms are submitted
2. Database storage of submissions
3. Admin dashboard to view all submissions
4. Automated service quotes
5. Customer account management
6. Online appointment booking

### Email Setup
```javascript
// Backend should handle sending emails like:
// - Confirmation email to customer
// - Notification email to admin
// - Automatic reply with estimated service time
```

## Styling Colors

- **Primary (Dark)**: #1a1a1a (Black)
- **Secondary (Red)**: #c41e3a (Wolf Pack Red)
- **Accent (Gold)**: #ffc107 (Gold)
- **Text**: #333 (Dark Gray)
- **Background Light**: #f8f9fa (Light Gray)

## Browser Support

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Tips for Deployment

1. **Domain Setup**: 
   - Purchase wolfpackautmotive.com domain
   - Point DNS to your hosting provider

2. **Hosting Options**:
   - GitHub Pages (free, static)
   - Netlify (free tier available)
   - Vercel (free tier available)
   - Traditional web hosting

3. **Backend Ready**:
   - Replace the localStorage system with API calls
   - Set up a server to handle form submissions
   - Configure email notifications

## Contact

For questions or modifications, refer to the form.html page for submission details.

---
**Last Updated**: May 25, 2026
**Website**: wolfpackautmotive.com
