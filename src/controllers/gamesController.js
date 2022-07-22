import { db } from '../databases/postgreSQL.js';
import joi from 'joi';

export async function getGames (req, res) {

    try {

        res.status(200).send('Test Get Games');

    } catch (error) {

        res.sendStatus(500);

    }

}

export async function postGames (req, res) {

    try {

        res.status(200).send('Test Post Games');

    } catch (error) {

        res.sendStatus(500);

    }

}