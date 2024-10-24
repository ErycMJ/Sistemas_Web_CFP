import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactSlider from 'react-slider';
import { FaEdit, FaTrash } from 'react-icons/fa';
import string from '../../String';
import toast from 'react-hot-toast';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesTransaction, setCategoriesTransaction] = useState([]);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [showEditTransactionForm, setShowEditTransactionForm] = useState(false);
  const [editTransactionData, setEditTransactionData] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteCategoryId, setDeleteTransactionId] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterText, setFilterText] = useState('');
  const [amountRange, setAmountRange] = useState([]);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    note: '',
    amount: '',
    currency: 'BRL', // Default currency
    recurrence: 'never', // Default recurrence
    end: null,
    remind: null,
    photo: null,
    transferTo: '',
    transferFrom: ''
  });

  const formRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategoriesForTransaction();
      await fetchTransactions();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.type) {
      fetchCategories();
    }
  }, [formData.type]);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(`${string}/transaction/getTransaction`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const adjustedTransactions = data.transactions.map(transaction => ({
        ...transaction,
        amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
      }));
      setTransactions(adjustedTransactions);
      const amounts = adjustedTransactions.map(t => t.amount);
      const minAmount = Math.min(...amounts);
      const maxAmount = Math.max(...amounts);
      setMin(minAmount);
      setMax(maxAmount);
      setAmountRange([minAmount, maxAmount]);
      setFilteredTransactions(adjustedTransactions); // Initialize filtered transactions
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${string}/category/getCategory`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setCategories(data.filter((category) => category.categoryType === formData.type));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategoriesForTransaction = async () => {
    try {
      const { data } = await axios.get(`${string}/category/getCategory`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setCategoriesTransaction(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleAddTransaction = async () => {
    try {
      const { data } = await axios.post(`${string}/transaction/addTransaction`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      toast.success(data.message);
      fetchTransactions();
      setFormData({});
      setShowAddTransactionForm(false);
    } catch (error) {
        toast.error(error.response.data.message);
    }
  };

  const handleEditTransaction = async () => {
    try {
      const { data } = await axios.put(`${string}/transaction/editTransaction/${editTransactionData._id}`,
            formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
      });
      toast.success(data.message);
      fetchTransactions();
      setFormData({});
      setEditTransactionData(null);
      setShowEditTransactionForm(false);
    } catch (error) {
        toast.error(error.response.data.message);
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      const { data } = await axios.delete(`${string}/transaction/deleteTransaction/${deleteCategoryId}`,
        { 
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }
      );
      toast.success(data.message);
      fetchTransactions();
      setShowDeleteConfirmation(false);
      setDeleteTransactionId(null);
    } catch (error) {
        toast.error(error.response.data.message);
    }
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowAddTransactionForm(false);
      setShowEditTransactionForm(false);
      setShowDeleteConfirmation(false);
      setFormData({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditButtonClick = (transaction) => {
    setFormData({
        type: transaction.type,
        category: transaction.category,
        date: transaction.date.split('T')[0],
        note: transaction.note,
        amount: transaction.amount,
        currency: transaction.currency,
        recurrence: transaction.recurrence,
        end: transaction.end,
        remind: transaction.remind,
        photo: transaction.photo,
        transferTo: transaction.transferTo,
        transferFrom: transaction.transferFrom
    });
    setEditTransactionData(transaction);
    setShowEditTransactionForm(true);
};

useEffect(() => {
    if (editTransactionData) {
    }
  }, [editTransactionData]);

  useEffect(() => {
  }, [formData]);

  const handleDeleteButtonClick = (transactionId) => {
    setDeleteTransactionId(transactionId);
    setShowDeleteConfirmation(true);
  };

  const getCategoryNameById = (id) => {  
    const category = categoriesTransaction.find((category) => category._id === id);  
    return category ? category.categoryName : "Dado Importado"
  };

  const handleFilterChange = () => {
    const filtered = transactions.filter(transaction => {
      const matchesCategory = filterCategory ? transaction.category === filterCategory : true;
      const matchesText = filterText ? transaction.note.includes(filterText) : true;
      const matchesAmount = transaction.amount >= amountRange[0] && transaction.amount <= amountRange[1];
      return matchesCategory && matchesText && matchesAmount;
    });
    setFilteredTransactions(filtered);
  };
  
  
  useEffect(() => {
    if (filterCategory === '' && filterText === '' && amountRange[0] === min && amountRange[1] === max) {
      setFilteredTransactions(transactions);
    } else {
      handleFilterChange();
    }
  }, [filterCategory, filterText, amountRange, transactions]);

  useEffect(() => {
    if (transactions.length) {
      const amounts = transactions.map(t => t.amount);
      const minAmount = Math.min(...amounts);
      const maxAmount = Math.max(...amounts);
      setMin(minAmount);
      setMax(maxAmount);
      setAmountRange([minAmount, maxAmount]);
      setFilteredTransactions(transactions); // Set filtered transactions initially
    }
  }, [transactions]);
  

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => setShowAddTransactionForm(true)}
          className="bg-green-800 px-5 py-3 rounded-3xl text-white hover:bg-green-700"
        >
         Adicionar Transação
        </button>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center">
          <label className="mr-2">Categoria:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos</option>
            {categoriesTransaction.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="mr-2">Pesquisa:</label>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search by Note"
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="mr-2">Quantidade:</label>
          <span className="text-gray-700 font-bold">{amountRange[0]}</span>
          <ReactSlider
            className="w-48 h-4 mx-2"
            thumbClassName="w-4 h-4 bg-green-800 rounded-full cursor-pointer"
            trackClassName="h-1 bg-gray-300 my-2"
            min={min}
            max={max}
            value={amountRange}
            onChange={(values) => setAmountRange(values)}
            withTracks={true}
          />
          <span className="mx-2"></span>
          <span className="text-gray-700 font-bold">{amountRange[1]}</span>
        </div>
      </div>

      {showAddTransactionForm && (
        <div
          ref={formRef}
          className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4">Adicionar transação</h3>
            <div className="flex justify-between">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                >
                  <option defaultValue={true}>Selecione o tipo</option>
                  <option value="expense">Despesa</option>
                  <option value="income">Ganhos</option>
                  {/* <option value="transfer">Transfer</option> */}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                Data
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            {formData.type !== "transfer" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Selecione a categoria</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {formData.type === "transfer" && (
              <>
                <div className="flex justify-between">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Transferir para
                    </label>
                    <select
                      name="transferTo"
                      value={formData.transferTo}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                    >
                      <option value="">Select User</option>
                      {/* {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username}
                        </option>
                      ))} */}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Transferir de
                    </label>
                    <select
                      name="transferFrom"
                      value={formData.transferFrom}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                    >
                      <option value="">Selecione o usuário</option>
                      {/* {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username}
                        </option>
                      ))} */}
                    </select>
                  </div>
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nota
              </label>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex justify-between">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Valor
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="BLR">BRL</option>
                  <option value="USD">USD</option>
                  {/* Add more currency options as needed */}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Recorrencia
              </label>
              <select
                name="recurrence"
                value={formData.recurrence}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="never">Nunca</option>
                <option value="oneD">Um dia</option>
                <option value="twoD">Dois dias</option>
                <option value="workD">Dias úteis</option>
                <option value="oneW">Uma semana</option>
                <option value="twoW">Duas semanas</option>
                <option value="fourW">Quatro semanas</option>
                <option value="oneM">Um mês</option>
                <option value="twoM">Dois meses</option>
                <option value="threeM">Três meses</option>
                <option value="sixM">Seis meses</option>
                <option value="oneY">Um ano</option>
              </select>
            </div>
            {formData.recurrence !== "never" ? (
              <>
                <div className="flex justify-between">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Data de término
                    </label>
                    <input
                      type="date"
                      name="end"
                      value={formData.end}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Lembrar data
                    </label>
                    <input
                      type="date"
                      name="remind"
                      value={formData.remind}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                </div>
              </>
            ) : null}
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <input
                type="file"
                name="photo"
                onChange={handlePhotoChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div> */}
            <div className="flex justify-end">
              <button
                onClick={handleAddTransaction}
                className="bg-green-800 px-5 py-3 rounded-3xl text-white hover:bg-green-700 mr-2"
              >
                Adicionar
              </button>
              <button
                onClick={() => setShowAddTransactionForm(false)}
                className="bg-red-600 px-5 py-3 rounded-3xl text-white hover:bg-red-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditTransactionForm && (
        <div
          ref={formRef}
          className="bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4">Editar transação</h3>
            <div className="flex justify-between">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                >
                  <option defaultValue={true}>Selecione o tipo</option>
                  <option value="expense">Despesa</option>
                  <option value="income">Ganhos</option>
                  <option value="transfer">Transferir</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            {formData.type !== "transfer" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Selecione a categoria</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {formData.type === "transfer" && (
              <>
                <div className="flex justify-between">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Transferir para
                    </label>
                    <select
                      name="transferTo"
                      value={formData.transferTo}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                    >
                      <option value="">Selecione o usuário</option>
                      {/* {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username}
                        </option>
                      ))} */}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Transferir de
                    </label>
                    <select
                      name="transferFrom"
                      value={formData.transferFrom}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                    >
                      <option value="">Selecione o usuário</option>
                      {/* {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username}
                        </option>
                      ))} */}
                    </select>
                  </div>
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Nota
              </label>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex justify-between">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                Quantia
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                Moeda
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="USD">BRA</option>
                  {/* Add more currency options as needed */}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
              Recorrência
              </label>
              <select
                name="recurrence"
                value={formData.recurrence}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              >
                
                <option value="never">Nunca</option>
                <option value="oneD">Um dia</option>
                <option value="twoD">Dois dias</option>
                <option value="workD">Dias úteis</option>
                <option value="oneW">Uma semana</option>
                <option value="twoW">Duas semanas</option>
                <option value="fourW">Quatro semanas</option>
                <option value="oneM">Um mês</option>
                <option value="twoM">Dois meses</option>
                <option value="threeM">Três meses</option>
                <option value="sixM">Seis meses</option>
                <option value="oneY">Um ano</option>
              </select>
            </div>
            {formData.recurrence !== "never" ? (
              <>
                <div className="flex justify-between">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Data de término
                    </label>
                    <input
                      type="date"
                      name="end"
                      value={formData.end}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                    Lembrar data
                    </label>
                    <input
                      type="date"
                      name="remind"
                      value={formData.remind}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                </div>
              </>
            ) : null}
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
              Foto
              </label>
              <input
                type="file"
                name="photo"
                onChange={handlePhotoChange}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              />
            </div> */}
            <div className="flex justify-end">
              <button
                onClick={handleEditTransaction}
                className="bg-green-800 px-5 py-3 rounded-3xl text-white hover:bg-green-700 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => setShowEditTransactionForm(false)}
                className="bg-red-600 px-5 py-3 rounded-3xl text-white hover:bg-red-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={formRef}
            className="bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md"
          >
            <h3 className="mb-4 text-lg font-medium text-green-800">
            Excluir transação
            </h3>
            <p>Tem certeza de que deseja excluir esta transação?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTransaction}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="bg-green-50 p-4 rounded-lg shadow-lg flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex space-x-4 mb-2">
                  <span className="text-xl font-bold text-green-800">
                    {getCategoryNameById(transaction.category)}
                  </span>
                  <span className="text-sm text-gray-700">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
                {transaction.type === "transfer" && (
                  <div className="flex space-x-2 mb-2 text-sm text-gray-700">
                    <span>De: {transaction.transferFrom}</span>
                    <span>Para: {transaction.transferTo}</span>
                  </div>
                )}
                <p className="text-sm text-gray-700">{transaction.note}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === "income"
                      ? "text-green-500"
                      : transaction.type === "expense"
                      ? "text-red-500"
                      : transaction.transferFrom === "me"
                      ? "text-black"
                      : "text-black"
                  }`}
                >
                  {`${transaction.amount} ${transaction.currency}`}
                </p>
                <div className="flex space-x-2">
                  <button
                    className="text-green-800 hover:text-green-500"
                    onClick={() => handleEditButtonClick(transaction)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteButtonClick(transaction._id)}
                    className="text-red-600 hover:text-red-400"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
};

export default Transaction;
