import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    // Check if the service is running
    const healthData = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        message: "Service is healthy",
        status: "OK"
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                healthData,
                "Health check passed successfully"
            )
        );
});

export {
    healthcheck
    }
    