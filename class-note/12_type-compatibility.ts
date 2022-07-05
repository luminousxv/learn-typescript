// 인터페이스
interface Developer {
  name: string;
  skill: string;
}
interface Person1 {
  name: string;
}

class Person2 {
  name: string;
  skill: string;
}


let developer: Developer;
let person: Person1;
developer = person; // 구조적으로 안됨(Developer 인터페이스의 skill이 person 변수에 없음)
developer = new Person2;
person = developer;

// 함수
let add = function (a: number) {
 // ...
}

let sum = function (a: number, b: number){
  // ...
}
sum = add;
add = sum; // 타입적으로 sum>add 임으로 error

// 제네릭
interface Empty<T> {
  //..
}
interface NotEmpty<T> {
  data : T
}

let empty1 : Empty<string>;
let empty2 : Empty<number>;
empty1 = empty2;
empty2 = empty1;

let notempty1 : NotEmpty<string>;
let notempty2 : NotEmpty<number>;
// error -> 인터페이스 안이 정의되어 있음으로 다르다고 판단
notempty1 = notempty2;
notempty2 = notempty1;
