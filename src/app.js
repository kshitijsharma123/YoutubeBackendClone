import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();


// Just for fun. REMOVE it Later 

// Tell the ip and the url hint by that ip

let urlHits = new Object
app.use((req, res, next) => {

    const { url, ip } = req;
    const identifier = `${url}-${ip}`;
    urlHits[identifier] = (urlHits[identifier] || 0) + 1;
    console.log({
        url,
        ip,
        urlHitCount: urlHits[identifier],

    })

    next();
})



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from './routes/user.route.js'
import videoRouter from './routes/video.route.js'
import likeRouter from './routes/like.route.js'
import commnetRouter from './routes/comment.route.js'

// routers declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commnetRouter);

export { app }