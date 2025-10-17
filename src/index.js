// index.js
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js'; // ✅ named import

dotenv.config({ path: './.env' });

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('❌ Database connection failed:', error);
  });




// basic approach to connect to database and start server
// ;(async()=>{
//     try {
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log("Error in connecting to database");
//             console.log(error);
//             process.exit(1);
//         });
//         app.listen(process.env.PORT, (error) => {
//             console.log("Connected to database");
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }) ()
