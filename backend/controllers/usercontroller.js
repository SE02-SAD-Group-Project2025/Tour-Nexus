import bcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export function createUser(req,res){
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        password: hashedPassword,
        

    })

    user.save()
        .then((data) => {
            res.status(201).json({
                message: "User created successfully",
             
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error creating user",
                error: err.message
            });
        });
}

export function loginUser(req, res){

    const { email, password } = req.body;

    User.findOne({ email: email })
        .then((user)=>{

            if(user == null){
                return res.status(404).json({
                    message: "User not found"
                });
            }
            else{

                const isPasswordCorrect = bcrypt.compareSync(password,user.password);
                if(isPasswordCorrect){
                    const token = jwt.sign({
                        fullname: user.fullname,
                        email: user.email,
                        phone: user.phone,
                        role: user.role
                    },
                    "secretkey"
                )
                    res.status(200).json({
                        message: "Login successful",
                        token: token,
                        role: user.role
                    });
                }else{
                    res.status(401).json({
                        message: "Invalid password"

                    });
                }

            }

        })
         .catch((err) => {
            console.error("Login error:", err); // log the full error on server
            res.status(500).json({
                message: "An error occurred during login",
                error: err.message
            });
        });

}


export async function updateTourist(req, res) {
    try{
        await User.updateOne({email:req.params.email},req.body);
        res.status(200).json({
            success: true,
            message: "Tourist updated successfully",
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error updating tourist",
        })
    }
}

export async function deleteTourist(req, res) {
try{
    await User.deleteOne({email:req.params.email});
    res.status(200).json({
        success: true,
        message: "Tourist deleted successfully",
    });
    }
catch(error){
    res.status(500).json({
        success: false,
        message: "Error deleting tourist",
    })
    }
    
}
export function isAdmin(req,res){
        if(req.user == null){
            return false;
        }
        if(req.user.role == "Admin"){
            return true;
        }
    }
export function isTourist(req,res){
        if(req.user == null){
            return false;
        }
        if(req.user.role == "Tourist"){
            return true;
        }
    }
export function isHotel_owner(req,res){
        if(req.user == null){
            return false;
        }
        if(req.user.role == "HotelOwner"){
            return true;
        }
    }
export function isGuide(req,res){
        if(req.user == null){
            return false;
        }
        if(req.user.role == "Guide"){
            return true;
        }
    }