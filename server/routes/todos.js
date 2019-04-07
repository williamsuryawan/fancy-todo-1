const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');
const {authentication} = require('../middlewares/authentication.js')
/* GET users listing. */

router.use(authentication)
router.post('/', TodoController.createTodo);
router.get('/', TodoController.displayTodoByUserId);
router.get('/:id', TodoController.displayIndividualTodo);
router.put('/:id', TodoController.editIndividualTodo);
router.delete('/:id', TodoController.deleteIndividualTodo);

module.exports = router;