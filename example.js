// console.log('message1:',018 - 015);
// console.log('message2:',String.raw`HelloTwitter\nworld`);
// console.log('message3:','This is a string.' instanceof String);
// console.log('message4:', 0.1 + 0.2 == 0.3);
// console.log('message5:', 0.3 + 0.2 == 0.5);
// console.log('message6:', 0.3 + 0.2 == 0.5);

// const isTrue = true == [];
// const isFalse = true == ![];
// console.log('message4:', isTrue + isFalse);
// const user = {
//   name: 'Alice',
//   greet: function () {
//     console.log(`Hello, my name is ${this.name}`);
//   },
// };

// setTimeout(user.greet.bind(user), 1000);

// //Always check for undefined and null explicitly if both are valid values in your application.
// if (user.age !== null && user.age !== undefined) {
//   console.log(`User's age is ${user.age}`);
// } else {
//   console.log('Age is not provided');
// }

// let user = {
//   name: 'Alice',
//   nothing: null,
// };
// console.log('user:', Number(user.nothing ?? 0) + 1);
// let number
// number = '3'

// console.log('qwe', 3 === Number('3'))

// const a = 'asdasd';
// const secondGrade = '1';
// const thirdGrade = '3';
const firstGrade = Number('3');
const secondGrade = Number('3');
const thirdGrade = Number('3');
const fourthGrade = Number('asdasd');
// let averageTotal;
// if (!isNaN(firstGrade) && !isNaN(secondGrade) && !isNaN(thirdGrade) && !isNaN(fourthGrade)) {
//   averageTotal = firstGrade + secondGrade + thirdGrade + fourthGrade;
// }
// console.log('averageTotal', 3 + null);
// const b = `${a.toUpperCase()}`
// console.log(b);

//biggest problem
// const key1 = { category: 'a', step: 1 };
// const key2 = { category: 'a', step: 1 };
// console.log(key1 === key2); // false
// console.log(JSON.stringify(key1) === JSON.stringify(key2)); // true
// console.log(key1 === JSON.stringify(key2)); // false

// const funct1 = async () => {
//   return { category: 'ab' };
// };
// const funct2 = async () => {
//   const a = await funct1();
//   return { category: 'abs', ...a };
// };
// const funct3 = async () => {
//   return { category: 'abs', category: 'as' }; //the result will be the last category value {category: 'ab, category: 'a'} = category: 'a'
// };
// funct2().then((e) => console.log('e', e));

// let val
// val = 1
// val ??= 'qwe';
// console.log(val);

// const mongoose = require('mongoose');

// // Define the schema
// const userSchema = new mongoose.Schema({
//   firstname: { type: String, required: true },
// });
// const User = mongoose.model('User', userSchema);

// const b = {
//   firstname: 'john',
//   middlename: 'john',
// };

// // Example usage
// const user = new User({
//   ...b,
// });

// console.log('myuser', user);

// const b = Number('INC');
// console.log('b', b ? 1: 0 + 1);
// console.log('b', b ? 1 : 0);
// const grades = [Number(firstGrade), Number(secondGrade), Number(thirdGrade), Number(fourthGrade)];
// console.log('asd', grades.some(isNaN));

// const a = ''
// const b = 'bb'

// console.log('example', a ?? b)

// const funct1 = async () => {
//   let a = [];
//   await funct2(a);
//   return a;
// };
// const funct2 = async (a) => {
//   a.push({ name: 'hello word' });
// };

// funct1().then((a) => console.log('a', a));
// let number = 123.43;

// // Round the number to 2 decimal places
// let roundedNumber = number.toFixed(2);

// console.log(roundedNumber);  // Output: "123.46"
// const name = 'asd'

// console.log('message:', name + ',')
// const amount = 101.01;
// const ex1 = parseFloat((Math.ceil(amount / 100) * 100).toFixed(2));
// console.log('role', ex1);

console.log(0.5 === 0.5)