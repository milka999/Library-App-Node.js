// Funkcije koje vrše pozive ka bazi podataka
import { db } from "../utils/db.server";
//import bcrypt from 'bcrypt';

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
  };

export const getUser = async(email: string) => {
    return await db.user.findUnique({
        where: {
            email,
        }
    });
};

export const getUserById = async(id: string) => {
    return await db.user.findUnique({
        where: {
            id,
        }
    });
};

/* export const createUser = async(email: string, name: string, password: string) => {
        //const {email, name, password} = user;
        return await db.user.create({
            data: {
                name,
                email,
                password,
            },
            select:{
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });
    }; */