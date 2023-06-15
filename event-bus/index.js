import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const PORT = 4005;

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;

  axios.post("http://localhost:4000/events", event); // posts service
  axios.post("http://localhost:4001/events", event); // comments service
  axios.post("http://localhost:4002/events", event); // query service
  axios.post("http://localhost:4003/events", event); // moderation service

  res.send({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
