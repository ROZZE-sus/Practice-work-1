import Role from "../model/Role.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id, roles) => {
  return jwt.sign({ id, roles }, process.env.JWT_SECRET || "secret", {
    expiresIn: "24h",
  });
};

class Authcontroller {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Введите username и password" });
      }

      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: "Пользователь с таким именем уже существует" });
      }

      const hashPassword = await bcrypt.hash(password, 7);

      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();

      const token = generateToken(user._id, user.roles);
      return res.status(201).json({ token });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка при регистрации" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Введите username и password" });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const token = generateToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка при входе" });
    }
  }

  async getAllUser(req, res) {
    try {
      const users = await User.find({}, { password: 0 });
      return res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка получения пользователей" });
    }
  }

  async createRols(req, res) {
    try {
      const userRole = await Role.findOne({ value: "USER" });
      const adminRole = await Role.findOne({ value: "ADMIN" });

      if (!userRole) {
        const user = new Role({ value: "USER" });
        await user.save();
      }
      if (!adminRole) {
        const admin = new Role({ value: "ADMIN" });
        await admin.save();
      }

      return res.json({ message: "Роли созданы" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка создания ролей" });
    }
  }
}

export default new Authcontroller();
