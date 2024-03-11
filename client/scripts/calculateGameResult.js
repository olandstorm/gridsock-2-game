export default function calculateGameResult() {
    const cellElements = document.querySelectorAll('.cell');
    const playerScores = {
      pink: 0,
      green: 0,
      blue: 0,
      yellow: 0
    };
  
    cellElements.forEach(cell => {
      // Create an array that will contain the class that defines the users color
      const colorClassList = Array.from(cell.classList).find(className => className.startsWith('user'));

      if (colorClassList) {
        // Retrieve the color by having the underscore as the separator and retrieving the color which comes after
        const color = colorClassList.split('_')[1];
        // Increment the color in playerScores by 1
        playerScores[color]++;
      }
    });
  
    console.log('game result:', playerScores);
  };
  