import { db } from '../databases/postgreSQL.js';
import joi from 'joi';

function convertDate (rental) {
    rental.rentDate = rental.rentDate.toISOString().substring(0, 10);
}

export async function getRentals (req, res) {

    const queryCustomerId = parseInt(req.query.customerId);
    const queryGameId = parseInt(req.query.gameId);
    
    try {

        let rentals = [];

        if (queryCustomerId && queryGameId) {

            const { rows: rentalsDB } = await db.query(`
                SELECT * FROM rentals 
                WHERE "customerId" = $1 AND "gameId" = $2`,
                [queryCustomerId, queryGameId]
            );
            rentals = rentalsDB;

        } else if (queryCustomerId) {

            const { rows: rentalsDB } = await db.query(`SELECT * FROM rentals WHERE "customerId" = $1`, [queryCustomerId]);
            rentals = rentalsDB;

        } else if (queryGameId) {

            const { rows: rentalsDB } = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1`, [queryGameId]);
            rentals = rentalsDB;

        } else {

            const { rows: rentalsDB } = await db.query(`SELECT * FROM rentals`);
            rentals = rentalsDB;

        }

        rentals.forEach(convertDate);

        for (let i = 0; i < rentals.length; i++) {
            const { rows: customer } = await db.query(`
                SELECT id, name FROM customers WHERE id = $1`, 
                [rentals[i].customerId]
            );
            rentals[i]['customer'] = customer[0];
        }

        for (let i = 0; i < rentals.length; i++) {
            const { rows: game } = await db.query(`
                SELECT games.id, games.name, games."categoryId", categories.name as "categoryName"  
                FROM games JOIN categories 
                ON games."categoryId" = categories.id 
                WHERE games.id = $1`, 
                [rentals[i].gameId]
            );
            rentals[i]['game'] = game[0];
        }

        res.send(rentals);

    } catch (error) {

        res.sendStatus(500);

    }

}



export async function postRentals (req, res) {

    const newRental = req.body;
    
    const rentalSchema = joi.object({
        customerId: joi.number().integer().min(1).required(),
        gameId: joi.number().integer().min(1).required(),
        daysRented: joi.number().integer().min(1).required()
    });

    const { error } = rentalSchema.validate(newRental);
    if (error) {
        res.sendStatus(400);
        return;
    }

    try {

        const {rows: customerDB} = await db.query(`SELECT * FROM customers WHERE id = $1`, [newRental.customerId]);
        if(customerDB.length === 0) {
            res.sendStatus(400);
            return;
        }

        const {rows: gameDB} = await db.query(`SELECT * FROM games WHERE id = $1`, [newRental.gameId]);
        if(gameDB.length === 0) {
            res.sendStatus(400);
            return;
        }

        const gameStockTotal = gameDB[0].stockTotal;
        const {rows: currentRentalsDB} = await db.query(`
            SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`, 
            [newRental.gameId]
        );
        if(currentRentalsDB.length >= gameStockTotal) {
            res.sendStatus(400);
            return;
        }

        let currentDate = new Date();
        currentDate = currentDate.toISOString().substring(0, 10);

        newRental['rentDate'] = currentDate;
        newRental['returnDate'] = null;
        newRental['delayFee'] = null;
        newRental['originalPrice'] = newRental.daysRented * gameDB[0].pricePerDay;

        const {customerId, gameId, daysRented, rentDate, returnDate, delayFee, originalPrice} = newRental;
        await db.query(`INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
        );

        res.sendStatus(201);

    } catch (error) {

        res.sendStatus(500);

    }

}


export async function returnRentals (req, res) {

    try {

        res.status(200).send('Test Return Rentals');

    } catch (error) {

        res.sendStatus(500);

    }

}


export async function deleteRentals (req, res) {

    try {

        res.status(200).send('Test Delete Rentals');

    } catch (error) {

        res.sendStatus(500);

    }

}