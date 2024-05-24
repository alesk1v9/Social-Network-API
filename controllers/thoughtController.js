const { User , Thought } = require('../models');

const getThoughts = async (req, res) => {
    try {
        const thought = await Thought.find();
        return res.status(200).json(thought);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getSingleThought = async (req, res) => {
    try {
        const thought = await Thought.findOne({_id: req.params.thoughtId});
        
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' })
        }

        res.status(200).json(thought);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const createThought = async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        res.status(200).json(thought);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }
        res.status(200).json(thought);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with this ID' });
        }

        res.status(200).json(thought);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const addReaction = async (req, res) => {
    
    console.log('addind reaction');
    console.log(req.body);

    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' })
        }

        res.status(200).json(thought);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const removeReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' })
        }

        res.status(200).json(thought);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    getThoughts,
    getSingleThought,
    createThought,
    deleteThought,
    updateThought,
    addReaction,
    removeReaction
};