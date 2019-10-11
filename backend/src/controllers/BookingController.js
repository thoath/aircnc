const Booking  = require('../models/Booking'); 
const Spot = require('../models/Spot');

module.exports = {

    async store(req, res) {
        
        const { user } = req.headers;
        const { spot_id } = req.params;
        const { date } = req.body;

        const booking = await Booking.create({
            user,
            spot : spot_id,
            date
        });

        await booking.populate('spot').populate('user').execPopulate();

        const ownerSocket = req.connectedUsers[booking.spot.user];

        if (ownerSocket) {
            req.io.to(ownerSocket).emit('booking_request', booking);
        }

        return res.json(booking);
    },

    async index(req, res) {
        
        const { user_id } = req.params;
        let bookings={};

        if ( user_id ) {
            bookings= await Booking.find({
                user : user_id
            }).populate('spot');
    
        } else {
            
            const { user } = req.headers;
            const spots = await Spot.find({user});

            bookings= await Booking.find({
                spot : spots
            }).populate('user');
        }

        return res.json(bookings);
    }

}