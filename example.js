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

// const firstGrade = '3';
// const secondGrade = '1';
// const thirdGrade = '3';
const firstGrade = Number('3');
const secondGrade = Number('3');
const thirdGrade = Number('3');
const fourthGrade = Number(undefined);
let averageTotal;
if (!isNaN(firstGrade) && !isNaN(secondGrade) && !isNaN(thirdGrade) && !isNaN(fourthGrade)) {
  averageTotal = firstGrade + secondGrade + thirdGrade + fourthGrade;
}
console.log('averageTotal', 3 + null);
