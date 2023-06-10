const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//middlewares:
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Illusoria academy of megic is open now...')
})

app.listen(port, () => {
    console.log(`magic academy is runnig on port: ${port}`);
})