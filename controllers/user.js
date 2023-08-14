import User from "../models/User.js"

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        res.status(200).json(user)

    } catch (err) {
        res.status(401).json({ message: err.message })
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)

        const friends = await Promise.all(user.friends.map(id => User.findById(id)))
        const formattedFriends = friends.map(({ _id, firstName, lastName, location, occupation, picturePath }) => {
            return { _id, firstName, lastName, location, occupation, picturePath }
        })
        res.status(200).json(formattedFriends)
    } catch (err) {
        res.status(401).json({ message: err.message })
    }
}

export const addRemoveFriends = async (req, res) => {
    try {
        const { id, friendsId } = req.params;

        const user = await User.findById(id)
        const friend = await User.findById(friendsId)

        if (user.friends.includes(friendsId)) {
            user.friends = user.friends.filter(id => id !== friendsId)
            friend.friends = friend.friends.filter(id => id !== id);
        } else {
            user.friends.push(friendsId)
            friend.friends.push(id)
        }
        await user.save()
        await friend.save()


        const friends = await Promise.all(user.friends.map(id => User.findById(id)))
        const formattedFriends = friends.map(({ _id, firstName, lastName, location, occupation, picturePath }) => {
            return { _id, firstName, lastName, location, occupation, picturePath }
        })
        res.status(200).json(formattedFriends)

    } catch (err) {
        res.status(401).json({ message: err.message })
    }
}