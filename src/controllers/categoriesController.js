import { db } from '../databases/postgreSQL.js';
import joi from 'joi';

export async function getCategories (req, res) {

    const queryOffset = req.query.offset;
    const queryLimit = req.query.limit;

    try {

        const { rows: categories } = await db.query(`SELECT * FROM categories LIMIT $1 OFFSET $2`, [queryLimit, queryOffset]);

        res.send(categories);

    } catch (error) {

        res.sendStatus(500);

    }

}

export async function postCategories (req, res) {

    const newCategorie = req.body

    const categorieSchema = joi.object({
        name: joi.string().required()
    });

    const { error } = categorieSchema.validate(newCategorie);
    if (error) {
        res.sendStatus(400);
        return;
    }

    try {

        const {rows: categorieDB} = await db.query(`SELECT * FROM categories WHERE name = $1`, [newCategorie.name]);
        if(categorieDB.length > 0) {
            res.sendStatus(409);
            return;
        }

        await db.query(`INSERT INTO categories (name) VALUES ($1)`, [newCategorie.name]);

        res.sendStatus(201);

    } catch (error) {

        res.sendStatus(500);

    }

}