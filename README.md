# TELUS Job Application Landing Page

A beautiful, modern job application landing page for TELUS built with Next.js, React, TypeScript, TailwindCSS, and Framer Motion.

## Features

- 🎨 **Beautiful Design**: Modern, responsive design with gradient backgrounds and smooth animations
- 📱 **Mobile Responsive**: Optimized for all device sizes
- ✨ **Smooth Animations**: Powered by Framer Motion for engaging user interactions
- 📝 **Complete Application Form**: Collects all required information including:
  - Personal details (name, email, phone)
  - Position selection
  - Employment status
  - Address
  - SSN (with proper formatting)
  - ID card upload
- 💾 **Data Storage**: Applications are saved to local JSON files
- 🔐 **Admin Dashboard**: Secure admin panel to view all applications
- 🎯 **Multiple Positions**: Support for various job positions
- 📁 **File Upload**: Secure handling of ID card uploads

## Available Positions

- Personalized Internet Assessor - English (US)
- Data Entry Specialist - English (US)
- Administrative Assistant - English (US)
- Financial Secretary - English (US)
- AI Training - English (US)
- Transcription - English (US)
- Translation - English (US)
- Data Collection - English (US)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion
- **File Handling**: Multer, fs-extra
- **Development**: ESLint, Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
job_app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── submit-application/
│   │   │   │   └── route.ts          # Handle form submissions
│   │   │   └── applications/
│   │   │       └── route.ts          # Fetch applications for admin
│   │   ├── only-admin/
│   │   │   └── page.tsx              # Admin dashboard
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Main landing page
│   └── components/
│       ├── Header.tsx                # Navigation header
│       ├── Footer.tsx                # Site footer
│       └── JobApplicationForm.tsx    # Application form component
├── data/                             # Generated data storage
│   ├── applications.json             # Application data
│   └── uploads/                      # Uploaded files
└── public/                           # Static assets
```

## Features in Detail

### Landing Page
- Hero section with animated content
- Available positions showcase
- Smooth scroll navigation
- Call-to-action buttons

### Application Form
- **Personal Information**: First name, last name, email, phone
- **Job Details**: Position selection, employment status
- **Address**: Full address input
- **Security**: SSN with proper formatting (XXX-XX-XXXX)
- **File Upload**: ID card upload with drag & drop support
- **Validation**: Form validation and error handling
- **Success Feedback**: Confirmation messages

### Admin Dashboard (`/only-admin`)
- View all submitted applications
- Search and filter functionality
- Responsive design
- Application details display
- File upload tracking

### Data Storage
- Applications saved to `data/applications.json`
- Uploaded files stored in `data/uploads/`
- Secure file naming with timestamps
- JSON format for easy data management

## Customization

### Brand Colors
The application uses a blue-purple gradient theme:
- Primary: Blue (#3B82F6 to #8B5CF6)
- Secondary: Purple (#8B5CF6)
- Background: Slate to Blue gradient
- Text: Gray scale

### Adding New Positions
Edit the `positions` array in `src/app/page.tsx`:

```typescript
const positions = [
  'Your New Position - Language (Region)',
  // ... existing positions
];
```

### Styling
All styling is done with TailwindCSS classes. The design is fully responsive and follows modern UI/UX principles.

## Security Considerations

- SSN is stored securely in JSON format
- File uploads are validated and stored safely
- Admin panel accessible via `/only-admin` route
- Form validation prevents malicious submissions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized with Next.js 15 and Turbopack
- Lazy loading for animations
- Efficient file handling
- Responsive images and assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please contact:
- Email: careers@telus.com
- Phone: +1 (555) 123-4567

---

**Built with ❤️ for TELUS using Next.js, React, and TailwindCSS**
