const Workout = require('../models/Workout');

const { errorHandler } = require('../auth');

module.exports.addWorkout = (req, res) => {

    let newWorkout = new Workout({
        userId: req.user.id,
        name: req.body.name,
        duration: req.body.duration
    });

    Workout.findOne({ name: req.body.name })
    .then(existingWorkout => {
        if(existingWorkout){
            return res.status(409).send({ message: 'Workout already exists' });
        } else {
            return newWorkout.save()
            .then(result => res.status(201).send({
                result: result
            }))
            .catch(error => errorHandler(error,req,res));
        }
    })
    .catch(error => errorHandler(error, req, res));
}

module.exports.getMyWorkouts = (req, res) => {
    return Workout.find({})
    .then(result => {
        if(result.length > 0){
            return res.status(200).send({workouts: result});
        }
        else{
            return res.status(404).send({ message: 'No workouts found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.updateWorkout = (req, res) => {
    let updatedWorkout = {
        userId: req.user.id,
        name: req.body.name,
        duration: req.body.duration
    }
    return Workout.findByIdAndUpdate(req.params.id, updatedWorkout)
    .then(workout => {
        if(workout){
            res.status(200).send({
                message: 'Workout updated successfully',
                updatedWorkout: workout});
        } else{
            res.status(404).send({message: 'Workout not found'});
        }
    }).catch(error => errorHandler(error, req, res));
}


module.exports.deleteWorkout = (req, res) => {
    Workout.findOneAndDelete({
        _id: req.params.id,
    })
    .then(result => {
        if(!result){
            return res.status(404).send({message: 'Workout not found'});
        }else{
            return res.status(200).send({message: 'workout deleted successfully'})
        }
    }).catch(error => errorHandler(error, req, res));
};


module.exports.completeWorkoutStatus = (req, res) => {
    Workout.findById(req.params.id)
    .then(workout => {
        if(!workout){
            return res.status(404).send({message: 'workout not found'})
        }
        if(workout.status === 'completed'){
            return res.status(200).send({message: 'workout already completed'})
        }
        workout.status = 'completed';

        return workout.save().then(updateWorkout =>{
            return res.status(200).send({
                message: 'workout status updated successfully',
                updatedWorkout: updateWorkout
            })
        })

    }).catch(error => errorHandler(error, req, res));
};