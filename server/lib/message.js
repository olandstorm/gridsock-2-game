let generateMessage = (user, message) => {
    return {
        user, 
        message, 
        createdAt: new Date().toLocaleString()
    };
};

module.exports = { generateMessage };