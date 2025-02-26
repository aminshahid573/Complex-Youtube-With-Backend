import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  // Check if videoId exists first, then validate it
  if (!videoId) {
    throw new ApiError(400, "Video Id is Required");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  // Check if video exists in Video model before proceeding
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const isLiked = await Like.findOne({
    video: new mongoose.Types.ObjectId(videoId),
    likedBy: req.user?._id,
  });

  if (isLiked) {
    await Like.findByIdAndDelete(isLiked._id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Dislike Video Successfully")); // Fixed typo in "Successfully"
  } else {
    const newLike = await Like.create({
      video: new mongoose.Types.ObjectId(videoId),
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Liked Video Successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  
  // Check if commentId exists first, then validate it
  if (!commentId) {
    throw new ApiError(400, "Comment Id is Required");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // Check if comment exists in Comment model before proceeding
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const isLiked = await Like.findOne({
    comment: new mongoose.Types.ObjectId(commentId),
    likedBy: req.user?._id,
  });

  if (isLiked) {
    await Like.findByIdAndDelete(isLiked._id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Dislike Comment Successfully")); // Fixed typo in "Successfully"
  } else {
    const newLike = await Like.create({
      comment: new mongoose.Types.ObjectId(commentId),
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Liked Comment Successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  // Check if tweetId exists first, then validate it (fixed comment)
  if (!tweetId) {
    throw new ApiError(400, "Tweet Id is Required");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet ID");
  }

  // Check if tweet exists in Tweet model before proceeding (fixed comment)
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const isLiked = await Like.findOne({
    tweet: new mongoose.Types.ObjectId(tweetId),
    likedBy: req.user?._id,
  });

  if (isLiked) {
    await Like.findByIdAndDelete(isLiked._id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Dislike Tweet Successfully"));
  } else {
    const newLike = await Like.create({
      tweet: new mongoose.Types.ObjectId(tweetId),
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Liked Tweet Successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  // Validate page number
  if (page < 1) {
    throw new ApiError(400, "Invalid page number");
  }

  const likes = await Like.find({
    likedBy: req.user?._id,
    video: { $exists: true } // Only get video likes
  })
  .populate({
    path: 'video',
    select: '_id thumbnail title description duration views isPublished',
    match: { isPublished: true } // Only get published videos
  })
  .skip((page - 1) * limit)
  .limit(limit);

  // Filter out null videos (unpublished ones are returned as null after populate)
  const filteredLikes = likes.filter(like => like.video !== null);
  
  const totalLikedVideos = await Like.countDocuments({
    likedBy: req.user?._id,
    video: { $exists: true }
  });

  // Calculate pagination details
  const totalPages = Math.ceil(totalLikedVideos / limit);
  const pagination = {
    totalPages,
    currentPage: Number(page),
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    totalLikedVideos
  };

  if (filteredLikes.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, {
        videos: [],
        pagination
      }, "No liked videos found")
    );
  }

  // Extract only video details from likes
  const videos = filteredLikes.map(like => like.video);

  return res.status(200).json(
    new ApiResponse(200, {
      videos,
      pagination
    }, "Liked videos fetched successfully")
  );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
