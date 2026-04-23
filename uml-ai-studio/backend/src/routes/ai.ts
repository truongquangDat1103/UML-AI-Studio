import { Router } from 'express'
import { generate, refine } from '../controllers/aiController.js'
import { verifyToken } from '../middlewares/auth.js'
import { quotaCheck } from '../middlewares/quotaCheck.js'

const router = Router()

router.post('/generate', verifyToken, quotaCheck, generate)
router.post('/refine', verifyToken, quotaCheck, refine)

export default router
