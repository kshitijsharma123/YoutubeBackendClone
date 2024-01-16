import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "");


        if (!token) throw new ApiError(401, "Unauthorized request")



        const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


        const user = await User.find({ _id }).select("-password -refreshToken");


        if (!user) throw new ApiError(401, "Invalid Access Token")

        // sending user in request Object
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, "ERROR in VERIFY\n\n\n", error)
    }
})