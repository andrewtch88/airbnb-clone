<div align="center">

![image](https://github.com/andrewtch88/airbnb-clone/assets/59404615/e739aad4-d645-4f35-a32f-fc1c8c3fc041)

# Airbnb Clone with Next.js 13!

<br />
<p>
Full Stack Airbnb Clone with Next.js 14: React, Tailwind CSS, Prisma, MongoDB, NextAuth (Google OAuth), Image Upload using Cloudinary CDN  
</p>
</div>
<br />

## Tech Stack

![architecture](https://github.com/andrewtch88/airbnb-clone/assets/59404615/8fe6130b-169b-4c94-bfed-fb2624d7c50b)
<br />

<table>
    <tr>
        <td>
<a href="#"><img src="https://github.com/andrewtch88/airbnb-clone/assets/59404615/412246f9-3717-44e6-95ac-e5b85d5432a6" alt="Alt text" width="60" height="60" /></a>
        </td>
        <td>
<a href="#"><img src="https://github.com/andrewtch88/airbnb-clone/assets/59404615/27dae3a8-2375-412a-835c-05b90cf73b0c" alt="Alt text" width="60" height="60" /></a>
        </td>
        <td>
<a href="#"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="" width="30" height="30" /></a>
        </td>
                <td>
<a href="#"><img src="https://user-images.githubusercontent.com/99184393/183096870-fdf58e59-d78c-44f4-bd1c-f9033c16d907.png" alt="Google" width="30" height="30" /></a>
        </td>
                        <td>
<a href="#"><img src="https://user-images.githubusercontent.com/99184393/179383376-874f547c-4e6f-4826-850e-706b009e7e2b.png" alt="" width="30" height="30" /></a>
        </td>
                              <td>
<a href="#"><img src="https://user-images.githubusercontent.com/99184393/181918664-569af962-756c-438c-b350-294f042e6f61.png" alt="" width="30" height="30" /></a>
        </td>
                        <td>
<a href="#"><img src="https://user-images.githubusercontent.com/99184393/180462270-ea4a249c-627c-4479-9431-5c3fd25454c4.png" alt="" width="30" height="30" /></a>
        </td>
                                      <td>
<a href="#"><img src="https://user-images.githubusercontent.com/99184393/229775276-a7cb148b-7fbd-4334-a07f-f2223bc49f62.png" alt="" width="30"height="30"/></a>
        </td>
      <td>
<a href="#"><img src="https://user-images.githubusercontent.com/99184393/204170976-0e5c6e2a-2b41-483d-adbd-d5d1e40b8d15.png" alt="" width="30"height="30"/></a>
        </td>
        <td>
<a href="#"><img src="https://user-images.githubusercontent.com/99184393/214867309-7b59fa0e-c872-484e-bc8f-462896c54d2a.png" alt="" height="30"/></a>
        </td>
    </tr>
</table>

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://#/">Typescript</a></li>
    <li><a href="https://nextjs.org/">Next.js</a></li>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://www.prisma.io">Prisma</a></li>
    <li><a href="https://stripe.com/">Stripe</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
  <li><a href="https://firebase.google.com">Mongodb</a></li>
  <li><a href="https://cloudinary.com/">Cloudinary</a></li>
  </ul>
</details>

<br />

## Features

Next JS Tailwind design\
Full responsiveness\
Google OAuth authentication\
Properties Reviews\
Image upload using Cloudinary CDN\
Calendars with react-date-range\
Booking / Reservation system\
Properties Management\
Search properties\
Basic Admin Dashboard\
Stripe Payment\
Fetching Data with React Server Components (Without API!)

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
  git clone https://github.com/SashenJayathilaka/Airbnb-Build.git
```

change directory

```bash
  cd Airbnb-Build
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

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

<div align="center">Don't forget to leave a star ⭐️</div>
