export const yearDiff = (timeStamp) => {
    let now = new Date();
    timeStamp = new Date(timeStamp);
    let diffYear = (now.getTime() - timeStamp.getTime()) / 1000;
    diffYear /= 60 * 60 * 24;
    return Math.abs(Math.round(diffYear / 365.5));
  };
  
  export const monthDiff = (timeStamp) => {
    let now = new Date();
    timeStamp = new Date(timeStamp);
    let diffMonth = (now.getTime() - timeStamp.getTime()) / 1000;
    diffMonth /= 60 * 60 * 24 * 7 * 4;
    return Math.abs(Math.round(diffMonth));
  };
  
  export const weekDiff = (timeStamp) => {
    let now = new Date();
    timeStamp = new Date(timeStamp);
    let diffTime = now.getTime() - timeStamp.getTime();
    let difWeek = diffTime / (1000 * 60 * 60 * 24 * 7);
    return Math.round(difWeek);
  };
  
  export const dayDiff = (timeStamp) => {
    let now = new Date();
    timeStamp = new Date(timeStamp);
    let diffTime = now.getTime() - timeStamp.getTime();
    let diffDay = diffTime / (1000 * 3600 * 24);
    return Math.round(diffDay);
  };