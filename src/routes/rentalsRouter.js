import { getRentals , postRentals , returnRentals , deleteRentals } from '../controllers/rentalsController.js';
import { Router } from 'express';

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', postRentals);
router.post('/rentals/:id/return', returnRentals);
router.delete('/rentals/:id', deleteRentals);

export default router;