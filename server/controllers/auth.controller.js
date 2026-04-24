import bcrypt from 'bcrypt';
import User from '../Schema/User.js';
import { getAuth } from '../config/firebase.js';
import { emailRegex, passwordRegex } from '../utils/regex.js';
import { formatDatatoSend, generateUsername } from '../utils/helpers.js';

// Signup
export const signup = (req, res) => {

    let { fullname, email, password } = req.body;

    // Validating the data from frontend
    if(fullname.length < 3){
        return res.status(403).json({ "error": "Fullname must be at least 3 letters long" })
    }
    if(!email.length){
        return res.status(403).json({ "error": "Enter Email" });
        
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({ "error": "Email is invalid" })
    }
    if(!passwordRegex.test(password)){
        return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })
    }

    bcrypt.hash(password, 10, async (err, hashed_password)=>{

        let username = await generateUsername(email);
        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        })

        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch(err => {

            if(err.code == 11000){
                return res.status(500).json({ "error": "Email already exists" })
            }

            return res.status(500).json({ "error": err.message })
        })

        

    })

};

// Signin
export const signin = (req, res) => {

    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email })
    .then((user) => {
        if(!user){
            return res.status(403).json({ "error": "Email not found" })
        }

        if(!user.google_auth) {

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
    
                if(err) {
                    return res.status(405).json({ "error": "Error occured while login please try again" })
                }
    
                if(!result) {
                    return res.status(403).json({ "error": "Incorrect password" })
                }else{
                    return res.status(200).json(formatDatatoSend(user))
                }
    
            })
        }else{
            return res.status(403).json({ "error": "Account was created using google. Try logging in with google." })
        }
        
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ "error": err.message })
    })

};

// Google Auth
export const googleAuth = async (req, res) => {
    let { access_token } = req.body;

    getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
        let { email, name, picture } = decodedUser;

        picture = picture.replace("s96-c", "s384-c")

        let user = await User.findOne({"personal_info.email": email})
        .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
        .then((u) => {
            return u || null
        })
        .catch(err => {
            return res.status(500).json({ "error": err.message })
        })

        if(user) { // login
            if(!user.google_auth){
                return res.status(403).json({ "error": "This email was signed up without google. please log in with password to access the account" })
            }
        }
        else { // signup
            let username = await generateUsername(email);

            user = new User({
                personal_info: { fullname: name, email, username }, google_auth: true
            })

            await user.save()
            .then((u) => {
                user = u;
            })
            .catch(err => {
                return res.status(500).json({ "error": err.message })
            })
        }

        return res.status(200).json(formatDatatoSend(user))

    })
    .catch(err => {
        return res.status(500).json({ "error": "Failed to authenticate you with google. Try with some other google account" })
    })
};

// Change Password
export const changePassword = (req, res) => {

    let { currentPassword, newPassword } = req.body;

    if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
        return res.status(403).json({ error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })
    }

    User.findOne({ _id: req.user })
    .then((user) => {

        if(user.google_auth){
            return res.status(403).json({ error: "You can't change account's password because you logged in through google" })
        }

        bcrypt.compare(currentPassword, user.personal_info.password, (err, result) => {
            if(err){
                return res.status(500).json({ error: "some error occured while changing the password, please try again later" });
            }

            if(!result){
                return res.status(403).json({ error: "Incorrect current password" });
            }

            bcrypt.hash(newPassword, 10, (err, hashed_password) => {
                
                User.findOneAndUpdate({ _id: req.user }, { "personal_info.password": hashed_password })
                .then((u) => {
                    return res.status(200).json({ status: 'password changed' })
                })
                .catch(err => {
                    return res.status(500).json({ error: "Some error occured while saving new password, please try again later" })
                })

            })
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "User not found" });
    })

};
