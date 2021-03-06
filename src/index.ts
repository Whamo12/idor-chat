import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import { Message } from './entity/Message';
require('dotenv').config();
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
const jwt = require('jsonwebtoken');
const middleware = require('./token.middleware');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(
  express.static(path.join(__dirname, '../frontend/dist/frontend'), {
    etag: false
  })
);
// start express server
const server_port = process.env.PORT || 5000;
var server_ip_address = process.env.IP || '127.0.0.1';
app.set('port', server_port);
app.set('server_ip_address', server_ip_address);
app.listen(server_port, () => console.log(`Server running on ${server_ip_address}:${server_port}`));
createConnection()
  .then(connection => {
    //Health check
    app.get('/ping', (req: Request, res: Response) => {
      res.status(200).json('pong');
    });
    // register respositories for database communication
    const userRepository = connection.getRepository(User);
    const messageRepository = connection.getRepository(Message);
    /**
     * @description Register user
     * @param {Request} req
     * @param {Response} res
     * @returns success message
     */
    app.post('/register', async (req: Request, res: Response) => {
      let user = new User();
      const { userName, password, confirmPassword, title } = req.body;
      if (!userName) return res.status(400).json('User name is invalid');
      const existUser = await userRepository.find({ where: { userName } });
      if (existUser.length) return res.status(400).json('A user with that user name already exists');
      user.userName = userName;
      if (!title) return res.status(400).json('Title is invalid');
      user.title = title;
      if (password !== confirmPassword) return res.status(400).json('Passwords do not match');
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          user.password = hash;
          user.active = false;
          const errors = await validate(user);
          if (errors.length > 0) {
            return res.status(400).json('User validation failed');
          } else {
            await userRepository.save(user);
            return res.status(200).json('User registered successfully');
          }
        });
      });
    });
    /**
     * @description Register user
     * @param {Request} req
     * @param {Response} res
     * @returns success message
     */
    app.patch('/user/update', middleware.checkToken, async (req: Request, res: Response) => {
      const { userId, title } = req.body;
      if (!title) return res.status(400).json('Title is invalid');
      if (!userId || isNaN(userId)) return res.status(400).json('User ID is invalid');
      let user = await userRepository.findOne(userId);
      if (!user) return res.status(404).json('User does not exist');
      user.title = title;
      await userRepository.save(user);
      return res.status(200).json('User patched successfully');
    });
    /**
     * @description Get active users
     * @param {Request} req
     * @param {Response} res
     * @returns active users
     */
    app.get('/users/active', middleware.checkToken, async (req: Request, res: Response) => {
      const activeUsers = await userRepository.find({ where: { active: true }, select: ['userName'] });
      return res.status(200).json(activeUsers);
    });
    /**
     * @description Get inactive users
     * @param {Request} req
     * @param {Response} res
     * @returns active users
     */
    app.get('/users/inactive', middleware.checkToken, async (req: Request, res: Response) => {
      const inactiveUsers = await userRepository.find({ where: { active: false }, select: ['userName'] });
      return res.status(200).json(inactiveUsers);
    });
    /**
     * @description Get user
     * @param {Request} req
     * @param {Response} res
     * @returns active users
     */
    app.get('/user/:userId', middleware.checkToken, async (req: Request, res: Response) => {
      if (!req.params.userId) return res.status(400).json('Invalid user ID');
      let user = await userRepository.findOne(req.params.userId, { select: ['userName', 'title'] });
      return res.status(200).json(user);
    });
    /**
     * @description Login to the application
     * @param {Request} req
     * @param {Response} res
     * @returns valid JWT token
     */
    app.post('/login', async (req: Request, res: Response) => {
      const { userName, password } = req.body;
      const user = await userRepository
        .createQueryBuilder('user')
        .where('user.userName = :userName', {
          userName
        })
        .getOne();
      if (user) {
        user.active = true;
        await userRepository.save(user);
        bcrypt.compare(password, user.password, (err, valid) => {
          if (valid) {
            // TODO: Generate secret key and store in env var
            let token = jwt.sign(
              { userName: user.userName, userId: user.id, active: user.active, title: user.title },
              process.env.JWT_KEY,
              { expiresIn: '1h' }
            );
            return res.status(200).json(token);
          } else {
            return res.status(400).json('Invalid password');
          }
        });
      } else {
        return res.status(400).json('The user name provided does not exist');
      }
    });
    /**
     * @description Logout of application
     * @param {Request} req
     * @param {Response} res
     * @returns valid JWT token
     */
    app.patch('/logout', middleware.checkToken, async (req: Request, res: Response) => {
      const { userId } = req.body;
      if (!userId) return res.status(400).json('Unable to log off.  Please contact a system administrator.');
      let user = await userRepository.findOne(userId);
      if (user) {
        user.active = false;
        await userRepository.save(user);
        return res.status(200).json('Successfully logged off');
      } else {
        return res.status(404).json('Logoff failed.  User does not exist');
      }
    });
    /**
     * @description Submit a message
     * @param {Request} req
     * @param {Response} res
     * @returns message success object
     */
    app.post('/message/submit', middleware.checkToken, async (req: Request, res: Response) => {
      let message = new Message();
      const { msg, userId } = req.body;
      if (!msg) return res.status(400).json('Message is invalid');
      let user = await userRepository.findOne(userId);
      message.message = msg;
      message.createdBy = message.lastUpdatedBy = user.userName;
      message.createdDate = message.lastUpdatedDate = new Date();
      const errors = await validate(message);
      if (errors.length > 0) {
        return res.status(400).send('Message validation failed');
      } else {
        let returnMsg = await messageRepository.save(message);
        res.status(200).json(returnMsg);
      }
    });
    /**
     * @description Update a message
     * @param {Request} req
     * @param {Response} res
     * @returns message success object
     */
    app.patch('/message/update/:msgId', middleware.checkToken, async (req: Request, res: Response) => {
      const msgId = req.params.msgId;
      const { msg, userId } = req.body;
      if (!userId) return res.status(400).json('User ID is invalid');
      const user = await userRepository.findOne(userId);
      if (!user) res.status(404).json('User does not exist');
      if (!msgId) return res.status(400).json('Message ID is invalid');
      let message = await messageRepository.findOne(msgId);
      if (message) {
        message.message = msg;
        message.lastUpdatedBy = user.userName;
        const errors = await validate(message);
        if (errors.length > 0) {
          return res.status(400).send('Message validation failed');
        } else {
          let returnMsg = await messageRepository.save(message);
          res.status(200).json(returnMsg);
        }
      } else {
        return res.status(404).json('Message does not exist');
      }
    });
    /**
     * @description Delete a message
     * @param {Request} req
     * @param {Response} res
     * @returns message success object
     */
    app.delete('/message/delete/:msgId', middleware.checkToken, async (req: Request, res: Response) => {
      if (!req.params.msgId) return res.status(400).send('Messsage ID is invalid');
      const msgId = req.params.msgId;
      let message = await messageRepository.findOne(msgId);
      if (!message) {
        return res.status(404).send('Message does not exist');
      } else {
        await messageRepository.delete(message);
        res.status(200).json('Message successfully deleted');
      }
    });
    /**
     * @description Retrieve all messages
     * @param {Request} req
     * @param {Response} res
     * @returns message success object
     */
    app.get('/messages', middleware.checkToken, async (req: Request, res: Response) => {
      let messages = await messageRepository.find({});
      return res.status(200).json(messages);
    });
  })
  .catch(error => {
    console.error('DB connection failed', error.message);
  });
