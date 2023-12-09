const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DEV_DB}`,
  log: ['error'],
});

module.exports = prisma;
