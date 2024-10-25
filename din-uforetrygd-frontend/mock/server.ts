import express from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true);
    },
  }),
);

const gradertUfoereMock = {
  pid: "81549300",
  grad: 50,
  tilgangstype: "PERSONLIG",
  innloggingstype: "LEVEL4",
  harGammelFullmaktmottaker: false,
  saker: [{ type: "UFORETRYGD", grad: 50, status: "LOPENDE" }],
};

app.get("/api/initiate", (req, res) => {
  res.json(gradertUfoereMock);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
