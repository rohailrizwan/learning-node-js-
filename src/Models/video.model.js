import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new mongoose.Schema(
  {
    videofile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    views:{
        type: Number,
        default:0,
    },
    ispublished:{
        type: Boolean,
        default:true,
    },
    onwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:""
    }
  },
  { timestamps: true },
);
videoSchema.plugin(mongooseAggregatePaginate)

export const video = mongoose.model('video', videoSchema);
