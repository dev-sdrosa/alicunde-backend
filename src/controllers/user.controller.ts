// import express, { Router } from 'express';
// // import { User } from '../models/user.model';

// const usersController: Router = express.Router();

// usersController.get('/', async (req: express.Request, res: express.Response) => {
//   const users = await User.find();

//   res.json(users);
// });

// usersController.post('/', async (req: express.Request, res: express.Response) => {
//   const { name, email, password } = req.body;

//   const newUser = new User({ name, email, password });
//   await newUser.save();

//   res.status(201).json(newUser);
// });

// export { usersController };