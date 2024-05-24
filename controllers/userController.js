const { User , Thought } = require('../models');

const friendsCount = async () => {
    const numberOfFriends = await User.aggregate([
        { $unwind: "$friends" },
        { $group: { _id: null, totalFriends: { $sum: 1 } } }
    ]);
    return numberOfFriends[0] ? numberOfFriends[0].totalFriends : 0;
};

const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        const userObj = {
            user,
            friendCount: await friendsCount(),
        };
        return res.status(200).json(userObj);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
            .populate('friends');

        const userObj = {
            user,
            friendCount: await friendsCount(),
        };

        if (!user) {
            return res.status(404).json({ message: 'No user with this ID' })
        }

        res.status(200).json(userObj);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that Id' })
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' })
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const addFriend = async (req, res) => {

    console.log('addind friend');
    console.log(req.body);

    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            { runValidators: true, new: true }
        )

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const deleteFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { userId: req.params.friendId } } },
            { runValidators: true, new: true }
        );
            if (!user) {
               return res.status(404).json({ message: 'No user with that ID' })
            }

        res.status(200).json(user);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


module.exports = {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
};