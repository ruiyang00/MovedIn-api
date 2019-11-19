var express = require('express');
var router = require('express-promise-router')();
var RoommateController = require('../controllers/roommates');
var { validateBody, schemas } = require('../helpers/routeHelper');
var passport = require('passport');
var passportConf = require('../passport');
var passportSignIn = passport.authenticate('local', { session: false });
var passportJWT = passport.authenticate('jwt', { session: false });
var passportGoogle = passport.authenticate('googleToken', { session: false });
var facebookToken = passport.authenticate('facebookToken', { session: false });


// the POST API for creating a room into our mongoDB
router.route('/creatroommate')
    .post(passportJWT, validateBody(schemas.roomSchema), RoomController.createRoom);


// the GET API for get all the rooms
router.route('/getroommates')
    .get(RoomController.getAllRoomsWithoutAuthenticated);

//  GET API for get the room's details
router.route('/gettheroommate')
    .get(passportJWT, RoomController.getTheRoomsAfterAuthenticated);

//  DELETE API for delete a room document from mongoDB 
router.route('/deletetheroommate')
    .delete(passportJWT, RoomController.deleteTheRoomBeingAuthenticated);



module.exports = router;