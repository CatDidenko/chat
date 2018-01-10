var helpers  = {
    delete: function(owner_id, user_id){
        if(owner_id == user_id){
            return true;
        }
    }
};

module.exports = {helpers};


