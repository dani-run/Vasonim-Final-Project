# This is the final project for Daniel Mîinea

#Create the .env file:
(DATABASE_URL="file:./dev.db"
SESSION_SECRET=<enter a random long value>)

# Setup
Install the dependencies:

```shellscript
npm install
```



Then create the database:

```shellscript
npx prisma db push
```

After this, generate the client(its a shortcut for changing into prisma and then running it)

```shellscript
npm run seed
```

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

