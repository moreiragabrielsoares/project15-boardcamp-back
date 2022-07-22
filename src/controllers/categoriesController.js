import { db } from '../databases/postgreSQL.js';
import joi from 'joi';

export async function getCategories (req, res) {

    try {

        res.status(200).send('Test Get Categories');

    } catch (error) {

        res.sendStatus(500);

    }

}

export async function postCategories (req, res) {

    try {

        res.status(200).send('Test Post Categories');

    } catch (error) {

        res.sendStatus(500);

    }

}