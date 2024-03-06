let generateMessage = (user, message, room, color) => {
  return {
    user,
    message,
    room,
    color,
    createdAt: new Date().toLocaleString(),
  };
};

module.exports = { generateMessage };
