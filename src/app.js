const express = require('express');
const app = express();
const path = require('path');
const hbs = require("hbs");
const Register = require('./models/register')
var docxConverter = require('docx-pdf');
const multer = require("multer")
const fs = require("fs");
const libre = require('libreoffice-convert');
const { send } = require('process');
require("./db/conn")

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, '../public');
const upload_path = path.join(__dirname, '../uploads');
const output_path = path.join(__dirname, '../output');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) =>{
    res.render('index');
});


 
// const inputfile = req.body.file;

// docxConverter('./uploads/input.docx','./outputs/output.pdf',function(err,result){
//     if(err){
//       console.log(err);
//     }
//     console.log('result'+result);
//   });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        "input.doc"
      );
    },
  });
   
   
  app.get('/docxtopdfdemo',(req,res) => {
    res.render('docxtopdfdemo',{title:"DOCX to PDF Converter - Free Media Tools"})
  })
   
  const docxtopdfdemo = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".docx" &&
      ext !== ".doc"
    ) {
      return callback("This Extension is not supported");
    }
    callback(null, true);
  };
   
  const docxtopdfdemoupload = multer({storage:storage,fileFilter:docxtopdfdemo})
   
   
  app.post('/docxtopdfdemo',docxtopdfdemoupload.single('file'),(req,res) => {
    if(req.file){
      console.log(req.file.path)
        
      
      docxConverter('./uploads/input.doc','./outputs/output.pdf',function(err,result){
        if(err){
          console.log(err);
        }
        console.log('result'+result);
        
        res.download('./outputs/output.pdf',(err) => {
            if(err){
            res.send("some error taken place in downloading the file")
            }
     
          })
      });
    }
  })








app.post('/', (req, res) => {
    const inputfile = req.body.file;
    console.log(inputfile);
    res.render('index', {
        inputfile: inputfile
    });
} );



app.get('/register', (req, res) =>{
    res.render('register');
});

app.post('/register', async (req, res) =>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirm_password;

        if (password===cpassword) {
            const registeremploy = new Register({
                fullname: req.body.fullname,
                gender: req.body.gender,
                age: req.body.age,
                email: req.body.email,
                password: password,
                confirm_password: cpassword
            })
            const register = await registeremploy.save();
            res.status(201).render("login");
        } else {
            res.send('password are not matching');
        }

    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/login', (req, res) =>{
    res.render('login');
});

app.post('/login', async (req, res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const useremail = await Register.findOne({email:email});
        if (useremail.password===password) {
           res.status(201).render("index");
        } else {
            res.status(400).send('Unable to sign in');
        }
    } catch (error) {
        res.status(400).send("unable to sign in");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });