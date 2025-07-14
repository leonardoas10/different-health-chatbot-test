import cors from '@fastify/cors';
import { fastifyHelmet } from '@fastify/helmet';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import multer from 'fastify-multer';
import mongoose, { ConnectOptions } from 'mongoose';

import routes from './routes';
import { DataSimulatorService } from './services/DataSimulator.service';

require('dotenv').config();
require('module-alias/register');

dotenv.config();

let server;

const start = async () => {
  try {
    server = Fastify({ logger: true });
    await server.register(fastifyHelmet, { global: true });
    await server.register(multer.contentParser);
    await server.register(cors);
    await server.register(routes, { prefix: '/v1' });

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const mongoURL = process.env.MONGO_ATLAS_URL || 'mongodb://127.0.0.1:27017/differenthealth';

    mongoose
      .connect(mongoURL, options as ConnectOptions)
      .then(async () => {
        console.log('Connected to MongoDB');

        const coll = mongoose.connection.db.collection('chatbotmessages');
        const wantedName = 'default';

        const already = await coll
          .listSearchIndexes(wantedName)
          .toArray()
          .catch(() => []);

        if (already.length === 0) {
          console.log('🛈 Vector index not found, creating…');

          await coll.createSearchIndex({
            name: wantedName,
            definition: {
              mappings: {
                dynamic: true,
                fields: {
                  embedding: {
                    type: 'knnVector',
                    dimensions: 1536,
                    similarity: 'cosine',
                  },
                  content: {
                    type: 'string',
                  },
                },
              },
            },
          });

          console.log('🛈 Index submitted: it will take 1-3 min to be ACTIVE.');
        } else {
          console.log('🛈 Vector index already exists.');
        }

        // Initialize data simulator for realistic health data
        await DataSimulatorService.generateHistoricalData(7);
        DataSimulatorService.start();
      })
      .catch((err) => console.error('Failed to connect to MongoDB', err));

    await server.listen({ port: (process.env.SERVER_PORT as any) || 8080, host: '0.0.0.0' });
    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log(`SERVER Running in: http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
