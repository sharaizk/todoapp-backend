const express = require("express");
const router = express.Router();
const currentdate = new Date()
const Task = require("../models/taskSchema");
require("../db/conn");

const ddate = `${currentdate.getFullYear()}-${(currentdate.getMonth() + 1).toString().padStart(2, "0")}-${currentdate.getDate().toString().padStart(2, "0")}`
//  CREATING THE TASKS

router.post("/task/create", async (req, res) => {
  const { userId, task } = req.body;
  if ((!userId, !task)) {
    return res.status(400).json({ error: "Incomplete Data" });
  }
  try {
    const findTask = await Task.findOne({ userId: userId, date: ddate });
    if (findTask) {
      const saveData = await Task.findOneAndUpdate(
        { userId: userId, date: ddate },
        { $push: { tasks: {task:task}} }
      );
      if (saveData) {
        return res.status(200).json({message:"Task Created"});
      }
      return res.status(400).json({ error: "WILL WORK ON THIS LATER" });
    } else {
      const taskData = new Task({ userId, tasks: { task: task } });
      const savedTask = await taskData.save();
      if (savedTask) {
        return res.status(200).send({ message: "This should work" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});


// GETTING THE TASKS
router.get("/task/get",async(req,res)=>{
    const {userId, date} = req.body

    if(!userId){
        return res.status(400).send({error:"Invalid User"})
    }
    try {
        const searchedTask = await Task.findOne({userId, date}).select({"_id":0, "tasks":1})
        if(searchedTask){
            return res.status(200).send(searchedTask)
        }
        else{
            return res.status(404).send({error:"No Task Found"})
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;

// SEARCHING ACCORDING TO DATE

router.get("/task/dateget", async(req,res)=>{
  const {userId,date} = req.query
  // const {userId, date} = req.body
  if(!userId){
    return res.status(400).send({error:"Invalid User"})
}
  try {
    const searchedTask = await Task.findOne({userId, date}).select({"_id":0})
    if(searchedTask){
      return res.status(200).send(searchedTask)
    }
    else{
      return res.status(404).send({error:"No Tasks for this user"})
    }

  } catch (error) {
    console.log(error)
  }
})


// COMPLETING TASK
router.patch('/task/complete',async(req,res)=>{
  const {userId, taskId} = req.body
  if(!userId || !taskId){
    return res.status(400).send({error:"Something went wrong"})
  }
  try {
    const findTask = await Task.findOne({ userId: userId, date:ddate });
    if(findTask){
      const updateData = await Task.updateOne({"tasks._id":taskId},{$set:{"tasks.$.status":"Completed"}})

      if(updateData){
        return res.status(200).send()
      }
      else{
        return res.status(400).send({error:"Can't update"})
      }
    }
    else{
      return res.status(404).send({error:"User not found"})
    }
    // return res.status(200).send(findTask)
  } catch (error) {
    console.log(error)
  }
})



// Deleting a Task
router.delete("/task/delete",async(req,res)=>{
    const {userId, taskId} = req.query
    if(!userId || !taskId){
        return res.status(400).send({error:"No Valid Info"})
    }
    try {
        const deleteTask = await Task.findOneAndUpdate({userId}, {$pull: { tasks: {_id:[taskId]}} })
        if(deleteTask){
        const tasks = await Task.findOne({userId})
            return res.status(200).send(tasks)
        }
        else{
            return res.status(404).send({error:"Something went wrong"})
        }
    } catch (error) {
        console.log(error)
    }
})
