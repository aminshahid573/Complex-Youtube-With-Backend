import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRouter from './routes/user.routes.js';
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"

//routes declaration
//url become /api/v1/users/* like /api/v1/users/register

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/videos", videoRouter)

export { app };
