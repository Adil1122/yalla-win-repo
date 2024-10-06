// @ts-ignore
import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema (
    {
        name: {type: String, required: true},
        slug: {type: String, required: true}
    }, 
    { 
        timestamps: true 
    }
)

const CategoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema, 'categories');
export default CategoryModel;