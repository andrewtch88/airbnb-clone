<div align="center">

![image](https://github.com/andrewtch88/airbnb-clone/assets/59404615/31f6a4f0-66aa-4944-9a42-7729e9495c33)

# Airbnb Clone!

<br />
<p>
Full Stack Airbnb Clone with Next 14, Tailwind CSS, Prisma, MongoDB, NextAuth (Google OAuth), Stripe, Live Chat using socket.io   
</p>
</div>
<br />

## Tech Stack

![image](https://github.com/andrewtch88/airbnb-clone/assets/59404615/c046932b-59a4-4396-aadc-8960992d0074)

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

### :gear: Create a projects folder in ur pc
Clone the project (open terminal in the folder)

```bash
  git clone https://github.com/andrewtch88/airbnb-clone.git
```

### Open your project in code editor
Right click the airbnb-clone folder and open in vscode?
 
### :bangbang: Prerequisites

- Install Node JS in your computer <a href='https://nodejs.org/en/'>HERE</a>
- Sign up for a Cloudinary account <a href='https://cloudinary.com/'>HERE</a>
- Sign up for a Google Cloud Platform <a href='https://console.cloud.google.com/'>HERE</a>
- And other accounts needed depending on the environment variable

### Create .env and .env.local file to Setup Environment Variables
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

## Install required packages in the terminal
```
npm i
```

## Setup Prisma

```bash
npx prisma db push
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

Any errors, kindly google and stackoverflow answers will help

<div align="center">Don't forget to leave a star ⭐️</div>
