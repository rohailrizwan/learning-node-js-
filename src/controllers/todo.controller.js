import { Todo } from "../models/todo.model.js";
import ApiError from "../utils/apierror.js";
import Apiresponse from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";



const addTodo = asyncHandler(async (req, res) => {
    const { title, description, date } = req.body

    if (!req.user || !req.user._id) {
        throw new ApiError("User not logged in", 401);
    }
    const requiredFields = [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'date', label: 'date' },
    ];

    const finderr = requiredFields.filter(({ key }) => !req.body[key] || req.body[key].trim() === '').map(({ key, label }) => ({
        field: key,
        message: `${label} is required`,
    }))

    if (finderr?.length > 0) {
        throw new ApiError('Fields are missing', 400, finderr);
    }


    const addtodo = await Todo.create({
        userId: req.user._id, // 👈 logged-in user id
        title,
        description,
        date,
    })

    return res.status(200).json(new Apiresponse(
        200, "Todo created successfully", addtodo
    ))


})

const getTodo = asyncHandler(async (req, res) => {

    const todos = await Todo.find({
        userId: req.user._id
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new Apiresponse(200, "User todos fetched successfully", todos)
    );
})

const deleteTodo = asyncHandler(async (req, res) => {
    const todo_id = req.params.id
    console.log(todo_id, "todoid");

    const getData = await Todo.findByIdAndDelete(todo_id)

    if (!getData) {
        return res.status(404).json(
            new ApiError("Todo not found", 404)
        );
    }

    return res.status(200).json(
        new Apiresponse(200, "Todo deleted successfully")
    );

})

const updateTodo = asyncHandler(async (req, res) => {
    const todo_id = req.params.id
    const { title, description, date } = req.body
    console.log(todo_id,title,description,date);
        
    const getData = await Todo.findByIdAndUpdate(todo_id,
        { title, description, date }, // update fields
        { new: true, runValidators: true } // options: return updated doc & validate
    )

    console.log(getData);
    

    if(!getData){
        throw new ApiError("Not updated",500)
    }
    if(getData){

         return res.status(200).json(new Apiresponse(
        200, "Todo updated successfully", getData
    ))
    }
})

export { addTodo, getTodo, deleteTodo ,updateTodo}