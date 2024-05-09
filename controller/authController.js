import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

// Register Controller
export const registerController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // validate
        if (!name) {
            next('Please provide name.')
        }
        if (!email) {
            next('Please provide email.')
        }
        if (!password) {
            next('Please provide password.')
        }
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            next('Email Already Register, Please LogIn.')
        }
        const user = await userModel.create({ name, email, password })
        // token
        const token = user.createJWT();
        res.status(201).send({
            success: true,
            message: 'User created successfully.',
            user,
            token,
        })
    } catch (error) {
        next(error)
    }
}

// LogIn controller
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body
        // validation
        if (!email || !password) {
            next("Please Provide All Fields.")
        }
        // find user by email
        const user = await userModel.findOne({ email })
        if (!user) {
            next("Invalid Username or Password")
        }
        // compare Password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            next("Invalid Username or Password")
        }
        const token = user.createJWT();
        res.status(200).json({
            success: true,
            message: "LogIn Successfully.",
            user,
            token,
        })
    } catch (error) {
        console.log(error);
    }
}

// user details controller
export const userDetailsController = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            next("User Not Found.");
        }
        res.json({ user: { name: user.name, email: user.email, bio: user.bio } });
    } catch (error) {
        next("Server Error.");
    }
}

// update user controller
export const updateUserController = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;

        const user = await userModel.findByIdAndUpdate(userId, updates, { new: true }); // return updated user
        if (!user) {
            next("User not found.")
        }
        res.json({ user });
    } catch (error) {
        console.log(error);
    }
}

// create post controller
export const createPostController = async (req, res, next) => {
    try {
        // const userId = req.userId;
        const { userId, content } = req.body;
        // validation
        if (!content) {
            next("please provide content.")
        }
        const post = new postModel({ userId, content });
        await post.save();

        res.status(201).json({ message: 'Post Created Successfully.' })
    } catch (error) {
        console.log(error);
        next("Server Error..");
    }
}

// all existing posts controller
export const existingPostController = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await postModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }); // get all recent posts

        const totalPosts = await postModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({ posts, totalPosts, totalPages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error.." });
    }
}

// get all posts by a user

export const postsByUserController = async (req, res) => {
    try {
        const userId = req.userId;
        //const user = await postModel.findById(userId);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await postModel.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 });

        const totalPosts = await postModel.countDocuments({ userId });
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({ posts, totalPosts, totalPages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error.." });
    }
}

// follow User controller
export const followUserController = async (req, res) => {
    try {
        const userId = req.userId;
        const followeeId = req.params.userId;

        if (userId === followeeId) {
            return res.status(400).json({ message: "You can't follow yourself." });
        }

        // Check if the user is already following the followee
        const existingFollower = await followerModel.findOne({ userId, followerId: followeeId });

        if (existingFollower) {
            // User is already following, so unfollow
            await followerModel.deleteOne({ userId, followerId: followeeId });
            // No need to decrease follower count as it was not increased before
            return res.status(200).json({ message: "Unfollowed successfully" });
        }

        // User is not following, so follow
        const follower = new followerModel({ userId, followerId: followeeId });
        await follower.save();

        // Increment follower count for the user being followed (followeeId)

        await userModel.findByIdAndUpdate(followeeId, { $inc: { followerCount: 1 } });

        return res.status(201).json({ message: "Followed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

// get followers controller
export const getFollowersController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const followers = await followerModel.find({ followerId: userId }).populate('followerId', 'name bio');
        const followerCount = await followerModel.countDocuments({ followerId: userId });


        if (!followers || followers.length === 0) {
            return res.status(404).json({ message: "No followers found for this user." });
        }

        res.json({ followerCount, followers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
}