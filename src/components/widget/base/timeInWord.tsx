export function timeInWord(milisec: number) {
  let sec = Math.floor(milisec / 1000);
  let word = '';
  if (sec > 3600) {
    word = Math.floor(sec / 3600) + 'h ';
    sec = sec % 3600;
  }
  word += Math.floor(sec / 60) + 'm ';
  sec = sec % 60;
  word += sec + 's';
  return word;
}
