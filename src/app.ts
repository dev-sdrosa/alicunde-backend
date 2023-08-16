import express from "express";
import bodyParser from "body-parser";
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const corsDomains = process.env.CORS_DOMAINS
	? process.env.CORS_DOMAINS.split(",")
	: "http://localhost:5000";

const app = express();

app.use(bodyParser.json());
app.use(
	cors({
		origin: corsDomains,
		credentials: true,
	})
);

const connectionString = process.env.DB_URL
	? process.env.DB_URL
	: `postgresql://postgres:password@localhost:5432/library`;

const db = new Sequelize(connectionString);

const Book = db.define("Book", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	title: {
		type: DataTypes.STRING,
	},
	chapters: {
		type: DataTypes.INTEGER,
	},
	pages: {
		type: DataTypes.INTEGER,
		// @ts-ignore
		belongsToMany: "Author",
		foreignKey: "bookId",
		otherKey: "authorId",
		through: "books_authors",
	},
});

const Author = db.define("Author", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
	},
});

Book.belongsToMany(Author, {
	foreignKey: "bookId",
	otherKey: "authorId",
	through: "books_authors",
});

Author.belongsToMany(Book, {
	foreignKey: "authorId",
	otherKey: "bookId",
	through: "books_authors",
});

Book.sync();
Author.sync();

app.post("/books", async (req, res) => {
	const book = {
		title: req.body.title,
		chapters: req.body.chapters,
		pages: req.body.pages,
	};
	await Book.create(book);

	res.status(201).json(book);
});

app.get("/books", async (req, res) => {
	const books = await Book.findAll();
	res.status(200).json(books);
});

app.post("/authors", async (req, res) => {
	const author = {
		name: req.body.name,
	};

	await Author.create(author);
	res.status(201).json(author);
});

app.get("/authors", async (req, res) => {
	const authors = await Author.findAll();
	res.status(200).json(authors);
});

app.get("/books/:id/average", async (req, res) => {
	const book: any = await Book.findByPk(req.params.id);
	const average = book.pages / book.chapters;
	res.status(200).json({
		id: book.id,
		average: average,
	});
});

app.listen(process.env.PORT, () => {
	console.log("Server running on " + process.env.PORT);
});
