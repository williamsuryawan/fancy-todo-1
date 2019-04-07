const express = require('express');
const router = express.Router();
const {authentication} = require('../middlewares/authentication')
const ProjectController = require('../controllers/projectController')


router.use(authentication)
router.get('/myinvitedproject', ProjectController.findProjectbyInvitedList)
router.get('/myactiveproject', ProjectController.findProjectbyActiveList)
router.get('/mycreatedproject', ProjectController.findProjectbyCreatedByUserId)
router.get('/', ProjectController.findAllProjects)
router.post('/create', ProjectController.createProject)
router.post('/invite/:projectId', ProjectController.inviteMember)
// router.delete('/invite/:id', ProjectController.removeMember)
router.post('/:projectId/create', ProjectController.createTodoinProject)
router.get('/:projectId/todos', ProjectController.findAllTodoinProject)
router.put('/:id', ProjectController.editIndividualTodoinProject)
router.delete('/:projectId/:id', ProjectController.deleteIndividualTodoinProject)
router.get('/detail/:projectId', ProjectController.findOneProject)
router.patch('/accept/:id', ProjectController.acceptProjectInvitation)
router.patch('/decline/:id', ProjectController.declineProjectInvitation)


module.exports = router;