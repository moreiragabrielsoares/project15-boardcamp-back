import { db } from '../databases/postgreSQL.js';
import joi from 'joi';

export async function getCustomers (req, res) {

    try {

        res.status(200).send('Test Get Customers');

    } catch (error) {

        res.sendStatus(500);

    }

}


export async function getCustomersById (req, res) {

    try {

        res.status(200).send('Test Get Customers By Id');

    } catch (error) {

        res.sendStatus(500);

    }

}



export async function postCustomers (req, res) {

    try {

        res.status(200).send('Test Post Customers');

    } catch (error) {

        res.sendStatus(500);

    }

}

export async function updateCustomers (req, res) {

    try {

        res.status(200).send('Test Update Customers');

    } catch (error) {

        res.sendStatus(500);

    }

}