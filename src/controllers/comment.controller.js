import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const totalComments = await Comment.countDocuments({
    video: new mongoose.Types.ObjectId(videoId),
  });
  const comments = await Comment.aggregate([
    { $match: { video: new mongoose.Types.ObjectId(videoId) } },
    { $sort: { createdAt: -1 } },
    { $skip: (parseInt(page) - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
        pipeline: [{ $count: "total" }],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        likesCount: { $ifNull: [{ $arrayElemAt: ["$likes.total", 0] }, 0] },
        owner: { $arrayElemAt: ["$owner", 0] }
      },
    },
    {
      $project: {
        content: 1,
        video: 1,
        owner: 1,
        createdAt: 1,
        likesCount: 1
      }
    }
  ]);

  const totalPages = Math.ceil(totalComments / parseInt(limit)); // Fixed: Parse limit to integer
  const hasNextPage = parseInt(page) < totalPages; // Fixed: Parse page to integer
  const hasPrevPage = parseInt(page) > 1; // Fixed: Parse page to integer

  return res.status(200).json(
    new ApiResponse(200, {
      comments,
      totalComments,
      pagination: {
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    })
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required.");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.create({
    content,
    video: new mongoose.Types.ObjectId(videoId),
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId) {
    throw new ApiError(400, "Comment Id is required");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content: content.trim() },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment Id is required");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
