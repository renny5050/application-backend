import express from 'express'
import cors from 'cors'
import usersRoutes from './routes/users.routes.js'
import dotenv from 'dotenv';
import specialtiesRoutes from './routes/specialties.routes.js';
import classesRoutes from './routes/classes.routes.js'
import studentClassRoutes from './routes/studentclass.routes.js'
import attendanceRoutes from './routes/attendance.routes.js'
import classMessageRoutes from './routes/classmessage.routes.js'
import itemsRoutes from './routes/items.routes.js'
import authRoutes from './routes/auth.routes.js'
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express()

app.use(cors())
app.use(express.json());
app.use(usersRoutes);
app.use(specialtiesRoutes);
app.use(classesRoutes);
app.use(studentClassRoutes);
app.use(attendanceRoutes);
app.use(classMessageRoutes);
app.use(itemsRoutes);
app.use(authRoutes);

app.listen(PORT, ()=>{console.log("Running on port:", PORT)});




