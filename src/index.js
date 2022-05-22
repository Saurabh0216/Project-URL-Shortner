const express = require('express');
const bodyParser = require('body-parser');

const route = require("./routes/route")
const { default: mongoose } = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://saurabhtripathi:knk1UnvgHtDySHWR@cluster0.qeoom.mongodb.net/Project4"
,  {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});