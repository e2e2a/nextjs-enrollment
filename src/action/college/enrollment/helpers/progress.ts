// progress.js
let progress = 0;

const setProgress = (value:any) => {
  progress = value;
};

const getProgress = () => {
  return progress;
};

export { setProgress, getProgress };
