let i = '1';

const hybrid = async () => {
  switch (Number(i)) {
    case 1:
      console.log('First case');
      break;
    case 2:
      console.log('Second case');
      break;
    default:
      console.log('false case');
      return i; // Return i if no case matches
  }
  i = Number(i) + 1;
  return { i };
};

hybrid().then((i) => {
  console.log('i', i.i);
});
