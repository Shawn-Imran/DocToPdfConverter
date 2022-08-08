const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/demo",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=> {
    console.log("connection successful");
}).catch((error)=>{
    console.log(error);
    
    ("no connection");
})
