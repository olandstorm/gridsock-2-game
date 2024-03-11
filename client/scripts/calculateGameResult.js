
export default function calculateGameResult() {
  
    const cellElements = document.querySelectorAll('.cell');
    const playerScores = {};

    cellElements.forEach(cell => {
      const colorClassList = Array.from(cell.classList).find(className => className.startsWith('user_'));
      if (colorClassList) {
        const color = colorClassList.split('_')[1];
        if (!playerScores[color]) {
          playerScores[color] = 1;
        } else {
          playerScores[color]++;
        }
      }
    });

    //socket something to emit result...somewhere
    console.log('game result:', playerScores);
  };
  