import Post from "../model/Post.js";

class PostController {

  async getAll(req, res) {
    try {
      const posts = await Post.find().populate("author", "username");
      return res.json(posts);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка получения постов" });
    }
  }

  async getOne(req, res) {
    try {
      const post = await Post.findById(req.params.id).populate("author", "username");
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }
      return res.json(post);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка получения поста" });
    }
  }

  async create(req, res) {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: "Введите title и content" });
      }

      const post = new Post({
        title,
        content,
        author: req.user.id,
      });
      await post.save();

      return res.status(201).json(post);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка создания поста" });
    }
  }

  async update(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }

      const isOwner = post.author.toString() === req.user.id;
      const isAdmin = req.user.roles.includes("ADMIN");

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Нет прав для редактирования этого поста" });
      }

      const { title, content } = req.body;
      if (title) post.title = title;
      if (content) post.content = content;

      await post.save();
      return res.json(post);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка обновления поста" });
    }
  }
  
  async remove(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }

      const isOwner = post.author.toString() === req.user.id;
      const isAdmin = req.user.roles.includes("ADMIN");

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Нет прав для удаления этого поста" });
      }

      await post.deleteOne();
      return res.json({ message: "Пост удалён" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка удаления поста" });
    }
  }
}

export default new PostController();
