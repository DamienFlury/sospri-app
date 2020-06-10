import { gql, ApolloServer, IResolvers } from 'apollo-server-micro';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const privateKey = 'fs454sd1f51:1sdf2;';

const prisma = new PrismaClient({ log: ['error', 'info'] });

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    messages: [Message!]!
  }
  type Message {
    id: ID!
    text: String!
  }
  type Query {
    users: [User!]!
    messages: [Message!]!
  }
  type Mutation {
    createUser(firstName: String!, lastName: String!, password: String!): User!
    createSession(username: String!, password: String!): String!
  }
`;

type CreateUserProps = {
  firstName: string;
  lastName: string;
  password: string;
};

type CreateSessionProps = {
  userName: string;
  password: string;
};

const resolvers: IResolvers<any, any> = {
  Query: {
    users: (_parent, _args, _context) => {
      return prisma.user.findMany();
    },
    messages: (_parent, _args, _context) => {
      return prisma.message.findMany();
    },
  },
  User: {
    messages: (user, _args, _context) => {
      return prisma.message.findMany({
        where: {
          userId: user.id,
        },
      });
    },
  },
  Mutation: {
    createUser: async (
      _parent,
      { firstName, lastName, password }: CreateUserProps,
      _context
    ) => {
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          password: hash,
          userName: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        },
      });
      return user;
    },
    createSession: async (_parent, { userName, password }, _context) => {
      const user = await prisma.user.findOne({ where: { userName } });
      if (!user) {
        throw new Error('user does not exist');
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          const token = jwt.sign({ userId: user.id }, privateKey, {
            expiresIn: 60 * 60,
          });
          return token;
        }
      });
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
