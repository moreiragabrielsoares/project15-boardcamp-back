import { db } from '../databases/postgreSQL.js';
import joi from 'joi';

export async function getGames (req, res) {

    const queryName = req.query.name;
    const queryOffset = req.query.offset;
    const queryLimit = req.query.limit;
    
    try {

        if(queryName) {
            const { rows: games } = await db.query(`
                SELECT games.*, categories.name as "categoryName" FROM games 
                JOIN categories
                ON games."categoryId" = categories.id
                WHERE games.name ILIKE $1 
                LIMIT $2 OFFSET $3`,
                [`${queryName}%`, queryLimit, queryOffset]
            );
            res.send(games);
            
        } else {
            const { rows: games } = await db.query(`
                SELECT games.*, categories.name as "categoryName" FROM games 
                JOIN categories
                ON games."categoryId" = categories.id 
                LIMIT $1 OFFSET $2`,
                [queryLimit, queryOffset]
            );
            res.send(games); 
        }

    } catch (error) {

        res.sendStatus(500);

    }

}

export async function postGames (req, res) {

    const newGame = req.body;

    const gameSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().uri().pattern(/(https?:\/\/.*\.(?:png|jpg|jpeg|svg))/).required(),
        stockTotal: joi.number().integer().min(1).required(),
        categoryId: joi.number().integer().min(1).required(),
        pricePerDay: joi.number().integer().min(1).required()
    });

    const { error } = gameSchema.validate(newGame);
    if (error) {
        res.sendStatus(400);
        return;
    }
    
    try {

        const {rows: gameDB} = await db.query(`SELECT * FROM games WHERE name = $1`, [newGame.name]);
        if(gameDB.length > 0) {
            res.sendStatus(409);
            return;
        }

        const {rows: categorieDB} = await db.query(`SELECT * FROM categories WHERE id = $1`, [newGame.categoryId]);
        if(categorieDB.length === 0) {
            res.sendStatus(400);
            return;
        }

        const {name, image, stockTotal, categoryId, pricePerDay} = newGame;
        await db.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5)`, 
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.sendStatus(201);

    } catch (error) {

        res.sendStatus(500);

    }

}