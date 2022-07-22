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

    try {

        res.status(200).send('Test Post Rentals');

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