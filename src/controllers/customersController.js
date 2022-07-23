import { db } from '../databases/postgreSQL.js';
import baseJoi from 'joi';
import joiDate from '@joi/date';
const joi = baseJoi.extend(joiDate);


function convertDate (customer) {
    customer.birthday = customer.birthday.toISOString().substring(0, 10);
}

export async function getCustomers (req, res) {

    const queryCustomers = req.query.cpf;
    
    try {

        if(queryCustomers) {
            const { rows: customers } = await db.query(`
                SELECT * FROM customers  
                WHERE cpf LIKE $1`,
                [`${queryCustomers}%`]
            );

            customers.forEach(convertDate);

            res.send(customers);

        } else {
            const { rows: customers } = await db.query(`SELECT * FROM customers`);
            
            customers.forEach(convertDate);
            
            res.send(customers);
        }

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

    const newCustomer = req.body;

    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
        birthday: joi.date().format('YYYY-MM-DD').less('now')
    });
    
    const { error } = customerSchema.validate(newCustomer);
    if (error) {
        res.sendStatus(400);
        return;
    }
    
    try {

        const {rows: customerDB} = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [newCustomer.cpf]);
        if(customerDB.length > 0) {
            res.sendStatus(409);
            return;
        }

        const {name, phone, cpf, birthday} = newCustomer;
        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) 
            VALUES ($1, $2, $3, $4)`, 
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);

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