import express from "express";
import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import { db } from "../utils/db.server";
import passport from 'passport';
import { isLoggedIn } from '../utils/passport';

import * as AuthService from "../controllers/auth-controllers";
const authRouter = express.Router();

authRouter.get('/login', async (req: Request, res: Response) => {
   res.render('login');
});

/* authRouter.post('/login', async(req, res) => {
    try{
        const password = req.body.password;
        const user = await AuthService.getUser(req.body.email);
        if(user){
            const match = await bcrypt.compare(password, user.password);
            if (match) {
            res.redirect('/');
            console.log();
            console.log("Right password!");
            } else {
            res.redirect('/login');
            console.log(isLoggedIn);
            console.log("Wrong password");
        }
    } 
    }catch(error: any){
        //return res.status(500).json(error.message);
    }
});  */

authRouter.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' })); 

/* authRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
   */

authRouter.get('/register', async(req: Request, res: Response) => {
    res.render('register');
});

authRouter.post('/register', async(req: Request, res: Response) => {
    /* try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await AuthService.createUser(req.body.email, req.body.name, hashedPassword);
        //return res.status(200).json(user);
        res.redirect('login');
    }catch(error: any){
        //return res.status(500).json(error.message);
    } */
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    const user = await db.user.create({
        data: { name, email, password: hashedPassword },
    });

    //res.json({ id: user.id, email: user.email, message: 'User registered successfully!' });
    res.redirect('login');
});

authRouter.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

authRouter.get('/logout', (req, res) => {
    res.render('logout');
})

export default authRouter;