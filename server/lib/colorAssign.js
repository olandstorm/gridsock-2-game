const allColors = ['pink', 'green', 'blue', 'yellow'];

// Assigned colors for each room
const assignedColors = {};

function selectColor(room) {
  const roomColors = assignedColors[room]
    ? assignedColors[room]
    : [...allColors];

  if (roomColors.length > 0) {
    const randomIndex = Math.floor(Math.random() * roomColors.length);
    const color = roomColors.splice(randomIndex, 1)[0];
    assignedColors[room] = roomColors;
    console.log(roomColors);
    return color;
  } else {
    return null;
  }
}

module.exports = { selectColor };
