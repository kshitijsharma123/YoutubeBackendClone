import 'dotenv/config'
import { connectDB } from './db/index.js';


import { app } from './app.js'
const PORT = process.env.PORT || 4000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log({ serverLive: true, PORT })
    })
});


