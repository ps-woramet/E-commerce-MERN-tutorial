import asyncHandler from 'express-async-handler';
import Color from '../model/Color.js';

//@desc Create new color
//@route POST /api/v1/colors
//@access Private/Admin
export const createColorCtrl = asyncHandler(async (req, res) => {
    const {name} = req.body;
    //color exists
    const colorFound = await Color.findOne({name})
    if(colorFound){
        throw new Error('Color already exists')
    }
    //create
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: 'success',
        message: 'Color created successfully',
        color,
    });
});

//@desc Get all colors
//@route GET /api/v1/colors
//@access Public
export const getAllColorsCtrl = asyncHandler(async (req, res) => {
    const colors = await Color.find()

    res.json({
        status: 'success',
        message: 'Colors fetched successfully',
        colors,
    });
});

//@desc Get single color
//@route GET /api/v1/colors/:id
//@access Public
export const getSingleColorCtrl = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id)

    res.json({
        status: 'success',
        message: 'Color fetched successfully',
        color,
    });
});

//@desc Update color
//@route PUT /api/v1/colors/:id
//@access Private/Admin
export const updateColorCtrl = asyncHandler(async (req, res) => {
    const {name} = req.body;
    //update
    const color = await Color.findByIdAndUpdate(
        req.params.id,{name,},{new:true,}
    );

    res.json({
        status: 'success',
        message: 'Color updated successfully',
        color,
    });
});

//@desc delete color
//@route DELETE /api/colors/:id
//@access Private/Admin
export const deleteColorCtrl = asyncHandler(async (req, res) => {
    await Color.findByIdAndDelete(req.params.id)
    res.json({
        status: 'success',
        message: 'Color deleted successfully',
    });
});