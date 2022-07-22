import { getCustomers , postCustomers , updateCustomers , getCustomersById } from '../controllers/customersController.js';
import { Router } from 'express';

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomersById);
router.post('/customers', postCustomers);
router.put('/customers/:id', updateCustomers);

export default router;