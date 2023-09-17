import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        image:{
            type: String,
            require: true,
        },
        products: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    ],
    },{
        timestamps: true
    }
);

const Category = mongoose.model('Category', CategorySchema);

export default Category;