'use strict';

var router = require('express').Router();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter');

var User = require('../api/users/user.model');

router.get('/', passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter', {
	successRedirect: '/stories',
	failureRedirect: '/signup'
}));

passport.use(new TwitterStrategy({
	consumerKey: '',
	consumerSecret: '',
	callbackURL: ''
}, function (token, refreshToken, profile, done) {
	User.findOne({'twitter.id': profile.id }, function (err, user) {
		if (err) done(err);
		else if (user) done(null, user);
		else {
			// twitter will not provide an email, so we'll just fake it
			var email = [profile.username , 'fake-auther-email.com'].join('@');
			User.create({
				email: email,
				photo: profile.photos[0].value,
				name: profile.displayName,
				twitter: {
					id: profile.id,
					name: profile.displayName,
					email: email,
					token: token
				}
			}, done);
		}
	});
}));

module.exports = router;
