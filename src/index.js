import dotenv from 'dotenv'; // initialize for reload all variable
import connectDB from './db/index.js';

dotenv.config({ path: './.env' }); // config for load all variable

connectDB().then(()=>{
    app.listen(process.env.Port,()=>{
        console.log(`Server is running on port ${process.env.Port}`);
    })
}).catch((error)=>{
    console.log(error);
    
})



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
