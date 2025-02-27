import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (!channelId) {
    throw new ApiError(400, "channel ID is required");
  }

  try {
    const existingSubscription = await Subscription.findOne({
      subscriber: req?.user._id,
      channel: channelId,
    });

    if (existingSubscription) {
      await Subscription.deleteOne({ _id: existingSubscription._id });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Channel Unsubscribed Successfully.."));
    } else {
      await Subscription.create({
        channel: channelId,
        subscriber: req?.user._id,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Channel Subscribed Successfully.."));
    }
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Faild to subscribe , try again."
    );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (!channelId) {
    throw new ApiError(400, "Channel ID required");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $sort: { createdAt: -1 }, // Add this to sort by newest first
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        subscriberDetails: 1,
      },
    },
    { $addFields: { subscriberDetails: { $first: "$subscriberDetails" } } },
  ]);

  if (!subscribers.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No subscribers found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched Sucessfully"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400,"Invalid Channel Id")
  }

  if(!channelId){
    throw new ApiError(400,"Channel Id is required")
  }
  
  try {
    const subscribedChannels = await Subscription.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(channelId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "channel", 
          foreignField: "_id",
          as: "channelDetails",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "channel",
          foreignField: "channel",
          as: "subscriberCount",
          pipeline: [
            {
              $count: "count"
            }
          ]
        }
      },
      {
        $addFields: {
          channelDetails: { $first: "$channelDetails" },
          subscriberCount: { $first: "$subscriberCount.count" }
        }
      },
      {
        $facet: {
          channels: [
            {
              $project: {
                channelDetails: 1,
                subscriberCount: { $ifNull: ["$subscriberCount", 0] }
              }
            }
          ],
          totalCount: [
            {
              $count: "count"
            }
          ]
        }
      },
      {
        $project: {
          subscribedChannels: "$channels",
          totalSubscribedChannels: {
            $first: "$totalCount.count"
          }
        }
      }
    ])
  
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed Channel Fetched Successfully."
      )
    )
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to Get Channels")
  }

});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
