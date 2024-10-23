import mongoose from "mongoose"

const goalLimitSchema = new mongoose.Schema(
  {
    goal: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

export const GoalLimit = mongoose.model("GoalLimit", goalLimitSchema)
