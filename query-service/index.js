import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const PORT = 4002;

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((c) => {
      return c.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(PORT, async () => {
  console.log(`Listening on port: ${PORT}`);

  const res = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log("Processing event:", event.type);

    handleEvent(event.type, event.data);
  }
});
