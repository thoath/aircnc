const Spot = require('../models/Spot');
const User = require('../models/User');

module.exports = {

    async index(req, res){
        const {tech} = req.query;

        const spots = await Spot.find({techs : tech});

        return res.json(spots);
    },
    async store(req, res) {
        const { filename } = req.file;
        const { company, techs, price } = req.body;
        const { user } = req.headers;

        const userObj = await User.findById(user);

        if (!userObj) {
            return res.status(400).json({error : 'User does not exist.'});
        }


        const spot = await Spot.create({
            thumbnail : filename,
            user,
            company,
            price,
            techs : techs.split(',').map(tech => tech.trim())
        });

        return res.json(spot);
    }

};