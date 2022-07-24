import { db } from '../databases/postgreSQL.js';
import joi from 'joi';

export async function getRentals (req, res) {

    try {

        res.status(200).send('Test Get Rentals');

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