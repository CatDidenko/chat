var exports = module.exports = {};

exports.chat = function(req, res){
    res.render('chat');
}

exports.createChat = function(req, res){
    res.render('createChatForm');
}