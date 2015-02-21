var user = require('../models/users.js');

var indexController = {

  initialize: function(req, res){
    res.render('find', {
      users: user.users,
      globalEvents : user.globalEvents,
      push : user.push
    });
  },

  searchForm: function(req, res){
    user.matchActivity(
      req.body.type,
      req.body.date,
      req.body.time,
      req.body.distance,
      req.body.pace,
      req.body.address
    );
    res.redirect('/');
  }
};

module.exports = indexController;
