import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { getUploadUrl } from '../controllers/upload.controller.js';

const router = Router();

router.get("/get-upload-url", verifyJWT, getUploadUrl);

export default router;
