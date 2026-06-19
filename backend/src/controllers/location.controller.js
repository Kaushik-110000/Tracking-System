import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Location } from "../models/locations.model.js";
import { Guard } from "../models/guard.model.js";
import mongoose from "mongoose";
axios.defaults.withCredentials = true;

const getCoordinates = asyncHandler(async (req, res) => {
  const { location } = req.body; // Extract location from request body
  console.log(req.body);
  if (!location) {
    return res.status(400).json(new ApiError("Location is required"));
  }
  var a = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  console.log(a);
  try {
    // const response = await axios.get(
    //   `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    // );
    // console.log(response);
    // if (response.data.length === 0) {
    //   return res.status(404).json(new ApiError("Location not found"));
    // }

    // const { lat, lon } = response.data[0]; // Extract latitude and longitude
    const lat = 23.381045284364518,
      lon = 85.32261942074129;
    return res.json(new ApiResponse(200, { latitude: lat, longitude: lon }));
  } catch (error) {
    console.log("Error in coordinates");
    console.log(error.message);
    console.log(error.response?.data);
    return res
      .status(500)
      .json(new ApiError("Failed to retrieve coordinates", error.message));
  }
});

const assignLocation = asyncHandler(async (req, res) => {
  const { guardId, latitude, longitude, duration, from, to } = req.body;

  if (!guardId || !latitude || !longitude || !duration || !from || !to) {
    throw new ApiError(400, "All fields are required");
  }

  const guard = await Guard.findById(guardId);
  if (!guard) {
    throw new ApiError(404, "Guard not found");
  }

  const location = await Location.create({
    guard: guardId,
    latitude,
    longitude,
    duration,
    from,
    to,
  });

  res
    .status(201)
    .json(new ApiResponse(201, location, "Location assigned successfully"));
});

const unassignTheGuard = asyncHandler(async (req, res) => {
  const { assignMentId } = req.params; // Extracting the ID properly

  if (!assignMentId) {
    throw new ApiError(404, "Assignment ID is missing");
  }

  if (!mongoose.Types.ObjectId.isValid(assignMentId)) {
    throw new ApiError(400, "Invalid assignment ID format");
  }

  const response = await Location.findByIdAndDelete(
    new mongoose.Types.ObjectId(assignMentId)
  );

  if (!response) {
    throw new ApiError(404, "Assignment not found or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Assignment deleted successfully"));
});

const getALocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  if (!locationId) {
    throw new ApiError(404, "Location id is missing");
  }

  const location = await Location.findById(
    new mongoose.Types.ObjectId(locationId)
  );
  if (!location) {
    throw new ApiError(404, "Assignment cannot be found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, location, "Fetched assignment"));
});

const getLatestAssignment = asyncHandler(async (req, res) => {
  let { guardId } = req.params;

  // Trim guardId to remove unwanted spaces or newlines
  guardId = guardId.trim();

  console.log({ guardId }, "req");

  if (!guardId) {
    throw new ApiError(400, "Guard ID is missing");
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(guardId)) {
    throw new ApiError(400, "Invalid Guard ID format");
  }

  const latestAssignment = await Guard.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(guardId) },
    },
    {
      $lookup: {
        from: "locations",
        localField: "_id",
        foreignField: "guard",
        as: "assignmentDetails",
      },
    },
    {
      $unwind: "$assignmentDetails", // Convert assignmentDetails array into separate documents
    },
    {
      $sort: { "assignmentDetails.updatedAt": -1 }, // Sort by latest updated document
    },
    {
      $limit: 1, // Get only the latest updated document
    },
  ]);

  if (!latestAssignment.length) {
    throw new ApiError(404, "No assignments found for this guard");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        latestAssignment[0],
        "Fetched latest guard assignment"
      )
    );
});

export {
  getCoordinates,
  assignLocation,
  unassignTheGuard,
  getALocation,
  getLatestAssignment,
};
