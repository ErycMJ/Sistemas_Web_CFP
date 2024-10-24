import express from 'express';
import { isAuthenticated } from "../Middlewares/auth.js"
import { addTransaction, editTransaction, deleteTransaction, getTransactions, getRecentTransactions, importTransactions } from "../Controllers/transaction.controller.js"
import upload from '../Middlewares/upload.js';

const router = express.Router();

router.post('/addTransaction', isAuthenticated, upload.single('photo'), addTransaction);
router.get('/getTransaction', isAuthenticated, getTransactions);
router.get('/getRecentTransactions', isAuthenticated, getRecentTransactions);
router.put('/editTransaction/:id', isAuthenticated, upload.single('photo'), editTransaction);
router.delete('/deleteTransaction/:id', isAuthenticated, deleteTransaction);
router.post('/import', isAuthenticated, importTransactions); // Nova rota para importar transações



export default router;
