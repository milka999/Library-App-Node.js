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
    if(req.body.name && req.body.email && req.body.password){
        AuthService.createUser(req.body.name, req.body.email, req.body.password);
        res.redirect('/login');
    }
   res.redirect('/register');
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