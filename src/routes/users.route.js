const express = require("express");
const router = express.Router();
const User = require('../models/User')


router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    try {
        if (!isValidOperation) {
            return res.status(400).send('Invalid updates')
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!user) {
            return res.status(404).send("User doesn't exist")
        }

        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(404).send(`user doesn't exist`)
        }
        res.send(`user ${user.name} Deleted`)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;
