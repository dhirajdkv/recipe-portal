# Recipe Portal

A modern React application for managing and discovering recipes.

## Features

- Recipe search and discovery
- Ingredient consolidation
- AI-powered recipe suggestions
- Shopping list generation

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dhirajdkv/recipe-portal.git
cd recipe-portal
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your values.

### Development

To run the development server:

```bash
npm start
```

### Building for Production

To create a production build:

```bash
npm run build
```

## Deployment to Vercel

### Automatic Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the following environment variables in Vercel:
   - `REACT_APP_API_URL`
   - `REACT_APP_GOOGLE_CLIENT_ID`
   - `REACT_APP_ENABLE_AI_FEATURES`
4. Deploy

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `REACT_APP_ENABLE_AI_FEATURES`: Enable/disable AI features (true/false)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.