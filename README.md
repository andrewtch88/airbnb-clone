<div align="center">

![image](https://github.com/andrewtch88/airbnb-clone/assets/59404615/399c2f8f-8951-46f0-99b9-74d99981b2de)

# Airbnb Clone!

<br />
<p>
Full Stack Airbnb Clone with Next 14, Tailwind CSS, Prisma, MongoDB, NextAuth (Google OAuth), Stripe, Live Chat using socket.io   
</p>
</div>
<br />

## Tech Stack

![image](https://github.com/andrewtch88/airbnb-clone/assets/59404615/e74ce2b8-6e22-4650-903d-95d59c7b87a6)

<br />

## Features

OAuth authentication\
Properties Reviews\
Image upload using Cloudinary CDN\
Reservation system\
Properties Management\
Search properties\
Basic Admin Dashboard\
Stripe Payment\
Fetching Data with React Server Components (Without API!)\
Live Chat using Socket.io, tanstack query for infinite loading of messages in batches, Websocket fallback: Polling with alerts

## :toolbox: Getting Started

### :bangbang: Prerequisites

- Install Node JS in your computer <a href='https://nodejs.org/en/'>HERE</a>
- Sign up for a Cloudinary account <a href='https://cloudinary.com/'>HERE</a>
- Sign up for a Google Cloud Platform <a href='https://console.cloud.google.com/'>HERE</a>

### :key: Setup Environment Variables (.env and .env.local file)
```bash
DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL=
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

```bash
NEXT_PUBLIC_GMAP_GEOCODING_API_KEY=
NEXT_PUBLIC_GMAP_PLACES_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_STRIPE_API_KEY=
NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET=
```

## Setup Prisma

```bash
npx prisma db push
```

### :gear: Installation

![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/next.js-20232A?style=for-the-badge&logo=next.js&logoColor=61DAFB)

## Install my-project with npm
```
npx create-next-app@latest project-name --typescript --eslint
```

```
cd project-name
```

## Install dependencies

### :test_tube: Install Tailwind CSS with Next.js

#### Install Tailwind CSS

![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Install tailwindcss and its peer dependencies via npm, and then run the init command to generate both `tailwind.config.js` and `postcss.config.js`.

```
npm install -D tailwindcss postcss autoprefixer
```

```
npx tailwindcss init -p
```

#### Configure your template paths

Add the paths to all of your template files in your `tailwind.config.js` file.
<br>

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### Add the Tailwind directives to your CSS

Add the `@tailwind` directives for each of Tailwind’s layers to your `./styles/globals.css` file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Clone the project

```bash
  git clone https://github.com/andrewtch88/airbnb-clone.git
```

change directory

```bash
  cd airbnb-clone
```

## Install required packages in the terminal
```
npm i
```

## Start the app

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

<div align="center">Don't forget to leave a star ⭐️</div>
