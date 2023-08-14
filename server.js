import express from "express"
import dotenv from "dotenv"
import "colors"
import cors from "cors"
import mongoose from "mongoose"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from 'path'
import { fileURLToPath } from "url" //propery set the path
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js"
import userRouters from "./routes/user.js"
import postRoutes from "./routes/post.js"
import authMiddleware from "./middleware/auth.js"
import { createPost } from "./controllers/post.js"


// CONFIGURATIONS 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
// app.use(bodyParse.json({limit:"30mb", extended:true}))
// app.use(bodyParse.urlencoded({limit:"30mb",extended:true }))
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage })

// ROUTES WITH FIELS
app.post("/auth/register", upload.single("picturePath"), register)
app.use("/posts", authMiddleware, upload.single('picturePath'), createPost)


//ROUTES
app.use("/auth", authRoutes)
app.use("/users", userRouters)
app.use("/posts", authMiddleware, postRoutes)


// MONGOOSE SETUP 
const PORT = process.env.PORT || 8000
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`.bgMagenta.white)
    })
}).catch((error) => console.log(`${error} did't connect`.bgRed.white))

