import { Router } from 'express';
import userModel from '../dao/models/user.models.js';
import { createHash, isValidPassword } from '../util.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, age, email, password } = req.body;
    console.log('user register');
    console.log(req.body);

    const exists = await userModel.findOne({ email });
    if (exists) return res.send({ status: 'error', message: 'User already exist.' });

    const user = {
      username,
      age,
      email,
      rol: 'user',
      password: createHash(password)
    };
    const result = await userModel.create(user);
    res.send({ status: "Success", message: "User was created successfull with ID:" + result.id });
  } catch (error) {
    console.error(error);
    res.send({ error: "failed to register user", message: error })
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) return res.status(401).send({ status: 'error', message: 'Inccorrect credentials.' });
    if (!isValidPassword(user, password)) {
      return res.status(401).send({ status: 'error', message: 'Inccorrect credentials.' });
    };
    req.session.user = {
      username: `${user.username}`,
      email: user.email,
      age: user.age,
      rol: user.rol
    };
    res.send({ status: "Success", payload: req.session.user, message: "User logging successfull" });
  } catch (error) {
    console.error(error);
    res.send({ error: "failed to login user", message: error });
  };
});

export default router;