import express from "express";
import {
  enterApp,
  adminLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/enter", enterApp);
userRouter.post("/admin", adminLogin);

export default userRouter;
