// function logText(text) {
//     console.log(text);
//     return text;
// }
// logText(10); //숫자 10
// logText('Hi'); //문자열 Hi
// logText(true); // 진위값 true

// function logText<T>(text:T):T {
//     console.log(text);
//     return text;
// }
// logText<string>('Hi');

// function logText(text: string) {
//     console.log(text);
//     // text.split('').reverse().join('');
//     return text;
// }

// function logNumber(num: number){
//     console.log(num);
//     return num;
// }

// function logText(text: string | number) {
//     console.log(text);
//     return text;
// }

// const a = logText('a');
// logText(10);
// const num1 = logNumber(10);
// logText(true);

function logText<T>(text: T): T {
  console.log(text);
  return text;
}

const abc = logText<string>('abc');
abc.split('');
const flag = logText<boolean>(true);

//인터페이스 제네릭을 선언하는 방법
// interface Dropdown {
//   value: string;
//   selected: boolean;
// }

// const obj: Dropdown = { value: 'abc', selected: false};

interface Dropdown<T> {
  value: T;
  selected: boolean;
}

const obj: Dropdown<string> = { value: 'abc', selected: false };

// 재네릭의 타입 제한
// function logTextLength<T>(text: T[]): T[] {
//   console.log(text.length);
//   text.forEach(function (text){
//     console.log(text);
//   })
//   return text;
// }

// logTextLength<string>(['hi', 'abc']);

// 제네릭 타입 제한 2 - 정의도니 타입 이용하기
interface LengthType {
  length: number;
}

function logTextLength<T extends LengthType>(text: T): T{
  text.length;
  return text;
}
logTextLength(10); //error
logText({length: 10});

// 제네릭 타입 제한 3 -keyof
interface ShoppingItem {
  name: string;
  price: number;
  stock: number;
}
function getShoppingItemOption<T extends keyof ShoppingItem>(itemOptions: T): T {
  return itemOptions;
}

// getShoppingItemOption(10);
// getShoppingItemOption<string>('a'); 
getShoppingItemOption("name");