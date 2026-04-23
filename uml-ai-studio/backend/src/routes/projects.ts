import { Router } from 'express'
import { list, getById, create, update, remove } from '../controllers/projectController.js'
import { verifyToken } from '../middlewares/auth.js'

const router = Router()

router.use(verifyToken)

router.get('/', list)
router.get('/:id', getById)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

export default router
