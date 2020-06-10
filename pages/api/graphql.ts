import { gql, ApolloServer, IResolvers } from 'apollo-server-micro';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
  }
`;

type CreateUserProps = {
  firstName: string;
  lastName: string;
  password: string;
};

const resolvers: IResolvers<any, any> = {
  Query: {
    users: (_parent, _args, _context) => {
      return prisma.user.findMany();
    },
    messages: (_parent, _args, _context) => {
      return prisma.message.findMany();
    }
  },
  User: {
    messages: (user, _args, _context) => {
      return prisma.message.findMany({
        where: {
          userId: user.id,
        }
      })
    }
  },
  Mutation: {
    createUser: (
      _parent,
      { firstName, lastName, password }: CreateUserProps,
      _context
    ) => {
      bcrypt.hash(password, 10, (err, hash) => {
        return prisma.user.create({
          data: {
            firstName,
            lastName,
            password: hash,
            userName: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
          },
        });
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
