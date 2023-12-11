const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DEV_DB}`,
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
}).$extends({
  query: {
    user: {
      async findUnique({ model, operation, args, query }) {
        // all users has to have their accounts confirmated in order for them to login the app
        args.where = { ...args.where, confirmationToken: { status: 'success' } };
        return query(args);
      },
    },
  },
});

module.exports = prisma;
