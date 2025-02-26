import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  console.table({ page, limit, query, sortBy, sortType, userId });
  //TODO: get all videos based on query, sort, pagination

  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Invalid Pagination Parameter");
  }

  const queryObject = {};

  if (userId) {
    try {
      queryObject.owner = mongoose.Types.ObjectId.createFromHexString(userId);
    } catch (error) {
      throw new ApiError(400, "Invalid User ID");
    }
  }

  if (query) {
    queryObject.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  console.log(queryObject);
  const sortObject = {};

  const allowedSortBy = ["title", "description", "createdAt", "updatedAt"];

  if (!allowedSortBy.includes(sortBy)) {
    throw new ApiError(400, "Invalid Sorting Parameter");
  }
  if (sortType !== "asc" && sortType !== "desc") {
    throw new ApiError(400, "Invalid Sorting Type");
  }
  sortObject[sortBy] = sortType === "desc" ? -1 : 1;

  try {
    const totalVideos = await Video.countDocuments(queryObject);
    const videos = await Video.aggregate([
      { $match: queryObject },
      { $sort: sortObject },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      // {$count: "totalVideos"}
    ]);

    const totalPages = Math.ceil(totalVideos / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videos,
          pagination: {
            page,
            limit,
            totalPages,
            hasNextPage,
            hasPrevPage,
            totalVideos,
          },
        },
        "Video fetched Sucessfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to fetch videos");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required!");
  }
  console.table({ title, description });

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
    throw new ApiError(500, "Failed to upload Video File");
  }

  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnailFile) {
    throw new ApiError(500, "Failed to upload Video File");
  }

  console.log(videoFile);
  console.log(thumbnailFile);

  console.log(videoFile.duration);
  console.log(typeof videoFile.duration);

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
  //TODO: get video by id
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
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          likes: 0,
        },
      },
    ]);

    if (!video) {
      throw new ApiError(400, "Video not found!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully!"));
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
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
