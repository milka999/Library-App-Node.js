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

export const deleteBook = async(id: number) => {
    return await db.book.delete({
        where: {
            id,
        }
    })
};

export const getAllBooks = async() => {
    return await db.book.findMany({
     include: {
        language: true,
        format: true,
        letter: true,
        categories: true,
        binding: true,
        authors: true,
    },}
        
    );
}

