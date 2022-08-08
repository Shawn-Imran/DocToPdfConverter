const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const employeeSchema = new mongoose.Schema({
    fullname: {
        type: 'string',
        required: true
    },
    gender:{
        type: 'string',
        required: true
    },
    age:{
        type:'Number',
        required: true
    },
    email:{
        type: 'string',
        required: true,
        unique: true
    },
    password:{
        type: 'string',
        required: true,
    },
    confirm_password:{
        type: 'string',
        required: true,
    }
})

employeeSchema.pre("save", async function (next) {
    if (this.isModified("password")){
        console.log('pass: ' + this.password);
        this.password = await bcrypt.hash(this.password, 10);
        console.log('password: ' + this.password);

        this.confirm_password=undefined;
    }
})

const Register = new mongoose.model('Register', employeeSchema);
module.exports = Register;