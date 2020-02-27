import { User } from './entity/User';
import { Message } from './entity/Message';
import { createConnection } from 'typeorm';
require('dotenv').config();

const reset = async () => {
  try {
    let connection = await createConnection();
    if (connection.isConnected) {
      console.info('Database connection created');
      // register respositories for database communication
      const userRepository = await connection.getRepository(User);
      const messageRepository = await connection.getRepository(Message);
      console.info('Wiping User Repository...');
      await userRepository.clear();
      console.info('User Repository Cleared');
      console.info('Wiping Message Repository...');
      await messageRepository.clear();
      console.info('Message Repository Cleared');
      console.info('Termiating database connection...');
      await connection.close();
      if (!connection.isConnected) {
        console.info('Database connection terminated');
      } else {
        console.error('Database termiation failed');
      }
    }
  } catch (error) {
    console.error('App Reset Failed: ', error);
  }
};

reset();
