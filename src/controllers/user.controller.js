import { asyncHandler } from './../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { uploadFileOnCloudinary, deleteFileOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'
// Model import
import { User } from "../models/user.model.js"



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        // creating Token using methods which are define in the schema of the userSchema in user.model.js file

        const AccessToken = user.generateAccessToken();
        const RefreshToken = user.generateRefreshToken()

        // Saving the refreshToken in database and validation are off 
        user.refreshToken = RefreshToken;
        await user.save({ validateBeforeSave: false });

        return { AccessToken, RefreshToken }

    } catch (error) {
        throw new ApiError(500, "Server ERROR while generation token")
    }
}


export const registerUser = asyncHandler(async (req, res) => {


    // 1) Take the information for req
    // 2) Check validators
    // 3)  If error then send the error message to the user
    // 4) Check user is new 
    // 5) check image,coverImage
    // 6) Upload to cloudinary
    // 7) check weather avtor is upload on cloudinary or not
    // 8) hash the password
    // 9) save the user in db 
    // 10) check user is created or not 
    // 11) Send the response {remove password and refresh token}to the user 


    const { fullName, email, username, password } = req.body


    // Checking emplty fields 
    if (fullName === "" || email === "" || username === "" || password === "") {

        throw new ApiError(400, "ALl fields are required")

    }

    // Checking user is new
    const existUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existUser) {
        throw new ApiError(409, "The user already exist")
    }


    // local File path of images, which is done using multer
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files.coverImage[0]?.path;


    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }



    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar File is Required")
    }

    // Uploading file {avatar image,coverImage} to the cloudinary server 
    const avatar = await uploadFileOnCloudinary(avatarLocalPath);
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);

    // checking file is uploaded {checking avatar only because it is required field}

    if (!avatar) {
        throw new ApiError(400, "avatar file is required")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username
    })

    // removing  password and refreshToken when sending data to user
    const createUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createUser) {
        throw new ApiError(500, "Something went wrong while registering the user ")
    }

    // Returning Response to the user
    return res.status(202).json(new ApiResponse(200, createUser, "User registered"));

})

export const loginUser = asyncHandler(async (req, res) => {

    //1) Take the information For req
    //2) Check if the user is present (using email,username)
    //3) Check refresh token , if present then send successToken 
    //4) Compare the password,if correct when login the user and send tokens 
    // 5) send token in cookie also

    const { email, username, password } = req.body



    if (!email && !username) {
        throw new ApiError(400, "Email or Username is Required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })


    if (!user) {
        throw new ApiError(404, "User does not found")
    }

    const isPasswordValued = await user.isPasswordCorrect(password);

    if (!isPasswordValued) throw new ApiError(401, "Invalid User password")

    const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(user._id);

    // ***********    // // Do this using obj also,once this one works
    const sendUser = await User.findOne(user._id).select("-password -refreshToken")
    
    // sending Cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
        cookie("AccessToken", AccessToken, options).
        cookie("RefreshToken", RefreshToken, options).
        json(new ApiResponse(200,
            {
                sendUser,
                AccessToken,
                RefreshToken
            },
            "User logged In Successfully"))
})

export const logoutUer = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            RefreshToken: undefined
        },
    }, {
        new: true
    }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
        .clearCookie("AccessToken", options)
        .clearCookie("RefreshToken", options)
        .json(new ApiResponse(200, {}, "User logout"))
})

export const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.RefreshToken || req.body.RefreshToken

    if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request");

    try {
        const { _id } = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findOne({ $and: [{ _id }, { RefreshToken: incomingRefreshToken }] });

        if (!user) throw new ApiError(404, "Bad Request");

        const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        res
            .status(200)
            .cookie("Refresh Token", RefreshToken, options)
            .cookie("AccessToken", AccessToken, options)
            .json(new ApiResponse(200, {}, "Send new Access Token"));

    } catch (error) {
        throw new ApiError(400, "ERROR IN DECODED\n\n\n\n", error)
    }


})

export const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body

    const { _id } = req.user[0];
    const user = await User.findOne(_id);

    if (!user) throw new ApiError(404, "Bad Request You are not logged")

    if (!await user.isPasswordCorrect(oldPassword)) throw new ApiError(404, "Old Password is incorrect")

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(201).json(new ApiResponse(201, {}, "Password is changed"))


})

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "successfully send user"))
})


export const updateAvatar = asyncHandler(async (req, res) => {

    // geting files in req object because of multer middleware
    const avatarLocalPath = req.file?.path;

    const { _id, avatar } = req.user[0];

    if (!avatarLocalPath) throw new ApiError(400, "Avatar file not saved");

    const newAvatar = await uploadFileOnCloudinary(avatarLocalPath);

    if (!newAvatar.url) throw new ApiError(500, "File not saved in cloudinary server");

    // deleting the file on cloudinary
    const fileDelele = await deleteFileOnCloudinary(avatar)
    if (!fileDelele === false) throw new ApiError(500, "Internal Server error while delete Olad Avatar")

    const user = await User.findByIdAndUpdate(_id,
        {
            $set: {
                avatar: newAvatar.url
            },
        },
        { new: true }  // new:true returns the updated doc 
    )

    res.status(200).json(new ApiResponse(200, { user }, "Avatar Image updated"))
})

export const updateCoverImage = asyncHandler(async (req, res) => {
    
    // geting files in req object because of multer middleware
    const CoverImagePath = req.file?.path;
    const { _id, coverImage } = req.user[0];

    if (!CoverImagePath) throw new ApiError(400, "CoverImage file not saved");

    const newCoverImage = await uploadFileOnCloudinary(CoverImagePath);

    if (!newCoverImage.url) throw new ApiError(500, "File not saved in cloudinary server");

    if (coverImage) {
        const fileDelele = await deleteFileOnCloudinary(coverImage);

        if (!fileDelele === false) throw new ApiError(500, "Internal Server error while delete CoverImage")
    }


    const user = await User.findByIdAndUpdate(_id,
        {
            $set: {
                coverImage: newCoverImage.url
            },
        },
        { new: true }  // new:true returns the updated doc 
    )
    res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Image updated"))

})

export const updateAccountDetails = asyncHandler(async (req, res) => {

    
    const { fullName, email, } = req.body;
    const { _id } = req.user;

    if (!fullName || !email) throw new ApiError(400, "Atlest one flieds is required");

    const user = await User.findByIdAndUpdate(_id, {
        $set: {
            email,
            fullName
        }
    }
        , { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account Updated"))

})


export const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params;
    if (!username?.trim()) throw new ApiError(400, "username missing");

    const channel = await User.aggregate([
        {
            $match: { username: username.toLowerCase() }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        }, {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                }, channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                }, isSubscribed: {
                    $cond: {
                        if: { $in: [req.user[0]?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        }, {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1
                , isSubscribed: 1
                , avatar: 1,
                coverImage: 1
            }
        }
    ])
    if (!channel?.length) throw new ApiError(404, "channel does not exists");


    res.status(200)
        .json(new ApiResponse(200, channel[0], "User channel fetch successfully"))
})


