import express from 'express'
import { PORT } from './config.js'
import usersRoutes from './routes/users.routes.js'
import cors from 'cors'


const app = express()

app.use(cors())
app.use(express.json());
app.use(usersRoutes);

app.listen(PORT);



