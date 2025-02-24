import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    if (!channelId) {
        throw new ApiError(400,"channel ID is required")
    }

    try {
        const existingSubscription = await Subscription.findOne({
            subscriber: req?.user._id,
            channel: channelId
        });

        if(existingSubscription){
            await Subscription.deleteOne({_id: existingSubscription._id})
            
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Channel Unsubscribed Successfully.."
                )
            )
        } else {
            await Subscription.create({
                channel : channelId,
                subscriber: req?.user._id
            })
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Channel Subscribed Successfully.."
                )
            )
        }
    } catch (error) {
        throw new ApiError(500,error?.message || "Faild to subscribe , try again.")
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}