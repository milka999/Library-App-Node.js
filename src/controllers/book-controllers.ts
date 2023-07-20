// Funkcije koje vrše pozive ka bazi podataka
import { db } from "../utils/db.server";

export type Book = {
    id: number;
    title: string;
    summary: string;
    page_count: number;
    release_year: number;
    isbn: string;
    format: Format;
    language: Language;
    letter: Letter;
    binding: Binding;
    categories: Category[];
    authors: Author[];
};

export type Language = {
    id: number;
    name: string;
};

export type Letter = {
    id: number;
    name: string;
};

export type Format = {
    id: number;
    name: string;
};

export type Binding = {
    id: number;
    name: string;
};

export type Category = {
    id: number;
    name: string;
};

export type Author = {
    id: number;
    name: string;
};

export const getBook = async(id: number) => {
    return await db.book.findUnique({
        where: {
            id,
        },
        include: {
            language: true,
            format: true,
            letter: true,
            categories: true,
            binding: true,
            authors: true,
        }
    } 
    )
};

/* export const createBook = async(book: Omit<Book, "id">) => {
    const {title, summary, page_count, release_year, isbn, format, language, letter, binding, categories, authors} = book;
    return await db.book.create({
        data: {
            title,
            summary,
            page_count,
            release_year,
            isbn,
            format: {
                connect: format
            },
            language: {
                connect: language
            },
            letter: {
                connect: letter
            },
            binding: {
                connect: binding
            },
            categories: {
                connect: categories
            },
            authors: {
                connect: authors
            }
        },
        select: {
            title: true,
            summary: true
        }
    })
};
 */
export const updateBook = async(id: number) => {
    return await db.book.update({
        where: {
            id,
        },
        data: {

        },
    }
        
    )

};

export const deleteBook = async(id: number) => {
    return await db.book.delete({
        where: {
            id,
        }
    })
};

export const getAllBooks = async() => {
    return await db.book.findMany();
}

