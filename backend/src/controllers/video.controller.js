import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideosById = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt", 
    sortType = "desc",
    userId,
  } = req.query;

  // Validate pagination params
  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Invalid pagination parameters");
  }

  // Build query object
  const queryObject = {};

  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    queryObject.owner = new mongoose.Types.ObjectId(userId);
  }

  // Only add search criteria if query is provided
  if (query) {
    queryObject.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // Validate and build sort object
  const allowedSortFields = ["title", "description", "createdAt", "updatedAt", "views"];
  if (!allowedSortFields.includes(sortBy)) {
    throw new ApiError(400, "Invalid sort field");
  }

  if (!["asc", "desc"].includes(sortType)) {
    throw new ApiError(400, "Sort type must be 'asc' or 'desc'");
  }

  const sortObject = {
    [sortBy]: sortType === "desc" ? -1 : 1
  };

  try {
    // Get total count for pagination based on query
    const totalVideos = await Video.countDocuments(queryObject);

    // Get paginated videos with owner details
    const videos = await Video.aggregate([
      { $match: queryObject },
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
      { $unwind: "$owner" },
      { $sort: sortObject },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    ]);

    const totalPages = Math.ceil(totalVideos / Number(limit));

    return res.status(200).json(
      new ApiResponse(200, {
        videos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalPages,
          totalVideos,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }, "Videos fetched successfully")
    );

  } catch (error) {
    throw new ApiError(500, "Failed to fetch videos");
  }
});

const getAllVideos = asyncHandler(async(req,res)=>{
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt", 
      sortType = "desc",
    } = req.query;

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortType === "desc" ? -1 : 1;

    // Get total count for pagination
    const totalVideos = await Video.countDocuments();

    // Get paginated videos with owner details
    const videos = await Video.aggregate([
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
      { $unwind: "$owner" },
      { $sort: sortObject },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    ]);

    const totalPages = Math.ceil(totalVideos / limit);

    return res.status(200).json(
      new ApiResponse(200, {
        videos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalPages,
          totalVideos,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }, "Videos fetched successfully")
    );

  } catch (error) {
    throw new ApiError(500, "Failed to fetch videos");
  }
})

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required!");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required!");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required!");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  if (!videoFile) {
    throw new ApiError(500, "Failed to upload video file");
  }

  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnailFile) {
    throw new ApiError(500, "Failed to upload thumbnail file"); // Fixed error message
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnailFile.url,
    title,
    description,
    duration: videoFile.duration,
    owner: req.user._id,
  });

  if (!video) {
    throw new ApiError(500, "Failed to publish video!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully!"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  
  if (!videoId) {
    throw new ApiError(400, "Video id is required!");
  }

  try {
    const video = await Video.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner"
        }
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          isLiked: {
            $cond: {
              if: req.user?._id ? {
                $in: [
                  new mongoose.Types.ObjectId(req.user._id),
                  {
                    $map: {
                      input: "$likes",
                      as: "like",
                      in: "$$like.likedBy"
                    }
                  }
                ]
              } : false,
              then: true,
              else: false
            }
          },
          owner: { 
            $let: {
              vars: { ownerDoc: { $arrayElemAt: ["$owner", 0] } },
              in: {
                _id: "$$ownerDoc._id",
                username: "$$ownerDoc.username",
                fullName: "$$ownerDoc.fullName",
                avatar: "$$ownerDoc.avatar"
              }
            }
          }
        },
      },
      {
        $project: {
          likes: 0,
        },
      },
    ]);

    if (!video?.length) {
      throw new ApiError(404, "Video not found!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video[0], "Video fetched successfully!"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch video!");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
  const updateData = {};

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (title) {
    if (title.length > 120)
      throw new ApiError(400, "Title exceeds 120 characters");
    updateData.title = title;
  }

  if (description) {
    if (description.length > 2000)
      throw new ApiError(400, "Description exceeds 2000 characters");
    updateData.description = description;
  }

  // Handle thumbnail upload
  if (req.file) {
    try {
      if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
        throw new ApiError(400, "Invalid thumbnail format (JPEG/PNG only)");
      }

      if (req.file.size > 2_097_152) {
        throw new ApiError(400, "Thumbnail exceeds 2MB size limit");
      }

      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult?.url) {
        throw new ApiError(500, "Cloudinary upload failed");
      }

      updateData.thumbnail = uploadResult.url;
    } catch (uploadError) {
      throw uploadError;
    }
  }

  // Validate at least one update field
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid update fields provided");
  }

  // Atomic document update
  const videoAfterUpdate = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateData },
    {
      new: true,
      projection: { __v: 0, internalState: 0 },
    }
  );

  if (!videoAfterUpdate) {
    throw new ApiError(404, "Video not found or update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoAfterUpdate, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  try {
    if (!videoId) {
      throw new ApiError(400, "Video Id Is Required");
    }
    const response = await Video.findByIdAndDelete(videoId);

    if (!response) {
      throw new ApiError(500, "Faild To delete");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Faild TO delete video, try again"
    );
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  const toggledVideoStatus = await Video.findByIdAndUpdate(
    videoId,
    [{ $set: { isPublished: { $not: "$isPublished" } } }],
    { new: true }
  );

  if (!toggledVideoStatus) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        toggledVideoStatus,
        "Video Status Changed Sucessfully"
      )
    );
});

export {
  getAllVideosById,
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
