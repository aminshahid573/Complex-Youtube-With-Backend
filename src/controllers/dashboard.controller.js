import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    

    const channelStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req?.user?._id),
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id", 
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: { $size: "$likes" } }
            }
        }
    ])

    const subscriberCount = await Subscription.countDocuments({
        channel: req?.user?._id
    })

    const stats = channelStats[0] || {
        totalVideos: 0,
        totalViews: 0,
        totalLikes: 0
    }

    stats.totalSubscribers = subscriberCount

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            { stats },
            "Channel stats retrieved successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req?.user?._id)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id", 
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                views: 1,
                thumbnail: 1,
                duration: 1,
                createdAt: 1,
                likesCount: { $size: "$likes" }
            }
        },
        {
            $facet: {
                videos: [
                    { $skip: skip },
                    { $limit: parseInt(limit) }
                ],
                totalVideos: [
                    { $count: "count" }
                ]
            }
        }
    ])

    const totalVideos = videos[0]?.totalVideos[0]?.count || 0;
    const totalPages = Math.ceil(totalVideos / limit);
    
    const response = {
        videos: videos[0]?.videos || [],
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalVideos,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                response,
                "Channel videos fetched successfully"
            )
        )
})

export {
    getChannelStats, 
    getChannelVideos
    }