import express from "express";
import { createPostController, existingPostController, followUserController, getFollowersController, loginController, postsByUserController, registerController, updateUserController, userDetailsController } from "../controller/authController.js";
import userAuth from "../middlewares/authMiddleware.js";


// router object
const router = express.Router();

// routes

// Register
router.post('/register', registerController);

// Login
router.post('/login', loginController);

// get user details
router.get('/user-details/:userId', userAuth, userDetailsController)

// UPDATE USER || PUT
router.put('/user-update/:userId', userAuth, updateUserController)

// create posts by user
router.post('/create-posts', userAuth, createPostController)

// get all existing posts (paginated)
router.get('/all-posts', userAuth, existingPostController)

// get all posts by a user (paginated)
router.get('/posts/:userId', userAuth, postsByUserController)


// follow a user
router.post('/user/:userId/follow', userAuth, followUserController);


// get all followers of a user
router.get('/user/:userId/get-followers', userAuth, getFollowersController);




// export
export default router;