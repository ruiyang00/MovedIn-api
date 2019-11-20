var Roommate = require('../models/roommate');
var jwtDecode = require('jwt-decode');

module.exports = {

    createRoommate: async (req, res, next) => {
        // get user's input Email & Paswword
        var { price, location, furniture, minLeaseDuration, wifi, capacity, token } = req.body;


        var decoded = jwtDecode(token);
        console.log(decoded.sub);
        var user_id = decoded.sub;
        //create a new user
        var newRoom = new Room({
            price: price,
            location: location,
            furniture: furniture,
            minLeaseDuration: minLeaseDuration,
            wifi: wifi,
            capacity: capacity,
            user_id: user_id
        });
        await newRoom.save();


        //Generate the token
        var message = "room create successful";
        //Respond with token
        res.status(200).json({ message });

    },

    getAllRoommatesWithoutAuthenticated: async (req, res, next) => {
        // get user's input room location
        var { location } = req.body;


        var allRoomsWithinLocation = {};
        // if user input location then search by location
        if (location === "") {
            allRoomsWithinLocation = await Room.find();
        } else {
            allRoomsWithinLocation = await Room.find({ "location": location });
        }

        //Respond with token
        res.status(200).json({ allRoomsWithinLocation });

    },

    // 
    getTheDeatialRoommateBeingAuthenticated: async (req, res, next) => {
        // get token from request header
        var token = req.headers.authorization;
        console.log('token is: ', req.headers.authorization);

        //decode the token to get the user's id
        var decoded = jwtDecode(token);
        console.log('user id: ', decoded.sub);
        var user_id = decoded.sub;

        // get the room id for the details of this room
        var room_id = req.headers.room_id;
        console.log(room_id);


        var room = await Room.findById(room_id);

        //If user doesn't match the room's user_id, handle it
        var message = '';
        if (room.user_id !== user_id) {
            message = 'No authtization to access to this room detail';
        } else {
            res.status(200).json({ room });
        }
    },

    deleteTheRoomBeingAuthenticated: async (req, res, next) => {

        // get the user id by decode the token
        var token = req.headers.authorization;
        console.log('token is: ', req.headers.authorization);
        var decoded = jwtDecode(token);
        console.log('user id: ', decoded.sub);
        var user_id = decoded.sub;

        //get the target room id to delete

        var room_id = req.headers.room_id;
        console.log(room_id);

        // find if the target room is belong's to the current user, if it is then delete no handler it.
        var room = await Room.findById(room_id);

        //If user doesn't match the room's user_id, handle it
        var message = '';
        if (room.user_id !== user_id) {
            message = 'the room does not belong to you'
        } else {

            Room.deleteOne({ "_id": room_id }, function (err) { });
            message = 'delete successfully'
        }
        res.status(200).json({ message });

    }




}