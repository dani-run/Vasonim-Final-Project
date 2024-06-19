import { PrismaClient } from "@prisma/client";
const db=new PrismaClient();


async function seed() {
    try {
      const users= await Promise.all(
        getAccount().map((user) => {
          return db.user.create({ data: user });
        }),
        );
        const userId= users[0].id; //assuming a single user for simplicity
        await Promise.all(
          getPosts(userId).map((post)=>{
            return db.post.create({ data: post });
          }),
        );
      console.log("Seeding completed successfully.");
    } catch (error) {
      console.error("Error occurred during seeding:", error);
    } finally {
      await db.$disconnect(); // close Prisma client connection
    }
  }

  seed();

function getAccount(){
    return [
        {
            username: 'dani',
            passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
            email: 'dani@dani',
        },
    ]
}

function getPosts(userId){
  return [
    {
      title: "TestU",
      section: "urgent",
      content: "Urgent cases section now open",
      reason: "Had to test really fast if this works",
      userId,
    },
    {
      title: "TestG",
      section: "general",
      content: "General questions section now open",
      userId,
    },
    {
      title: "TestI",
      section: "informational",
      content: "Informational resources section now open",
      userId,
    },
  ]
}