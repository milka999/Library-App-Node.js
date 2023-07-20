import express from "express";
import type { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import { db } from "../utils/db.server";
import session from 'express-session';
import { isLoggedIn } from '../utils/passport';


// promijeni summary iz string u text tip
// okači kod na Github
// probaj da malo refkatorišeš sve da bude čitljivije
// prepravi frontend da bolje izgleda

import * as BookService from "../controllers/book-controllers";

const bookRouter = express.Router();




//rute
bookRouter.get('/', async (req: Request, res: Response) => {
    try{
        const books = await BookService.getAllBooks();
        res.render('books', {books: books});
        //return res.status(200).json(books);
    }catch(error: any){
        return res.status(500).json(error.message);
    }
});

bookRouter.get('/new-book', isLoggedIn, (req: Request, res: Response) => {
    /* if(req.session == true){
        res.render('new_book');
    } else {
        res.render('not-accessible');
    } */
    res.render('new_book');
});

bookRouter.post('/new-book', async (req: Request, res: Response) => {
    try{
        const {title, summary, category, authors, release_year, page_count, language, letter, binding, format, isbn} = req.body;
        //const [categories] = req.body.category;
        const categories = Array.from(category);
        const book = await db.book.create({
            data: {
                title: title,
                summary: summary,
                page_count: parseInt(page_count),
                release_year: parseInt(release_year),
                isbn,
                categories: {
                    connect: categories.map((c:any) => ({ id: parseInt(c) })),
                },
                authors: {
                    connectOrCreate: [{
                        where: {name: req.body.authors.toString()},
                        create: {name: req.body.authors.toString()}
                        },
                        {
                        where: {name: req.body.authors1.toString()},
                        create: {name: req.body.authors1.toString()}
                        },
                        {
                        where: {name: req.body.authors2.toString()},
                        create: {name: req.body.authors2.toString()}
                    }]
                },
                language: {
                    connect: {id: parseInt(req.body.language)}
                },
                letter: {
                    connect: {id: parseInt(req.body.letter)}
                },
                binding: {
                    connect: {id: parseInt(req.body.binding)}
                },
                format: {
                    connect: {id: parseInt(req.body.format)}
                },
               
            }
        });
        console.log(req.body);
        res.redirect('/');
    }catch(error: any){
        return res.status(500).json(error.message);
        console.log(error);
    }
});

/* bookRouter.get('book_details/:id', async (req, res) => {
    try{
        const book = await BookService.getBook(req.params.id);
        console.log(book);
        console.log(req.params.id);
        res.render('/book_details', {book: book});
        console.log(res.status(200).json(book));
    }catch(error: any){
        return res.status(500).json(error.message);
    }
}); */

bookRouter.get('/book/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id.split(':')[1]);
    //console.log(id);
    //console.log(req.params.id);
    console.log(req.session);
    try {
        const book = await db.book.findUnique({
          where: { 
            id,
            
         },
            include: {
            categories: true,
            authors: true,
            letter: true,
            language: true,
            binding: true,
            format: true,
        }
        });
        const authors = await 
        res.render('book_details', { book:book });
        console.log(book); 
    } catch (error: any) {
        console.log(error);
    }
  });

bookRouter.get('/edit/:id', isLoggedIn, async (req: Request, res: Response) => {
    try{
        const book = await BookService.getBook(parseInt(req.params.id.split(':')[1]));
        res.render('editbook', {book: book});
        //return res.status(200).json(book);
    }catch(error: any){
        //return res.status(500).json(error.message);
    }
});

bookRouter.post('/edit/:id', async (req: Request, res: Response)=>{
    try{
        const id = parseInt(req.params.id.split(':')[1]);
        //console.log(req.body.category);
        //const bookId = parseInt(req.params.id);
        const {title, summary, category, authors, release_year, page_count, language, letter, binding, format, isbn} = req.body;
        const categories = Array.from(category);
        const book = await db.book.update({
            data: {
                title: title,
                summary: summary,
                page_count: parseInt(page_count),
                release_year: parseInt(release_year),
                isbn,
                categories: {
                    connect: categories.map((c:any) => ({ id: parseInt(c) })),
                },
                authors: {
                    connectOrCreate: [{
                        where: {name: req.body.authors.toString()},
                        create: {name: req.body.authors.toString()}
                        },
                        {
                        where: {name: req.body.authors1.toString()},
                        create: {name: req.body.authors1.toString()}
                        },
                        {
                        where: {name: req.body.authors2.toString()},
                        create: {name: req.body.authors2.toString()}
                    }]
                },
                language: {
                    connect: { id: parseInt(req.body.language) },
                },
                letter: {
                    connect: {id: parseInt(req.body.letter)}
                },
                binding: {
                    connect: {id: parseInt(req.body.binding)}
                },
                format: {
                    connect: {id: parseInt(req.body.format)}
                },
               
            },
            where: {
                id,
            },
        });
        res.redirect('/');
    }catch(error: any){
        console.error(error); 
        return res.status(500).json({ error: error.toString() });
    }
});

bookRouter.get('/delete/:id', isLoggedIn, async(req: Request, res: Response) => {
    try{
        const book = await BookService.getBook(parseInt(req.params.id.split(':')[1]));
        res.render('delete', {book: book});
        //return res.status(200).json(book);
    }catch(error: any){
        //return res.status(500).json(error.message);
    }
});

bookRouter.post('/delete/:id', async (req: Request, res: Response) => {
    try{
        await BookService.deleteBook(parseInt(req.params.id.split(':')[1]));
        //return res.status(200);
        res.redirect('/');
    }catch(error: any) {
        return res.status(500).json(error.message);
    }
});

export default bookRouter;