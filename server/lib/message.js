let generateMessage = (user, message, room) => {
  return {
    user,
    message,
    room,
    createdAt: new Date().toLocaleString(),
  };
};

module.exports = { generateMessage };
