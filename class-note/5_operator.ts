// function logMessage(value: string) {
//     console.log(value);
// }
// logMessage('hello');
// logMessage(100); //error

//union type
let seho1: string | number;
function logMessage(value: string | number){
    if (typeof value === 'number') {
        value.toLocaleString();
    }
    if (typeof value ==='string') {
        value.toString();
    }
    throw new TypeError('value must be string or number');
}
logMessage('hello');
logMessage(100);

interface Developer { 
    name: string;
    skill: string;
}

interface Person1 {
    name: string;
    age: number;
}

function askSomeone( someone: Developer | Person ) {
    someone.name;
    someone.skill; //error
    someone.age; //error
    // 위의 Developer/Person 인터페이스에서 공통된 'name'만 사용 가능
    // 'skill', 'age'를 사용 하려면 위 'typeof'로 구분 해야됨
}
askSomeone({ name: '디벨로퍼', skill: '웹 개발'});
askSomeone({ name: '캡틴', age: 100 });

// intersection type
let capt: string & number & boolean; //type: never

function askSomeone1 ( someone: Developer & Person) {
    someone.name;
    someone.skill;
    someone.age;
}
// Person, Developer의 타입을 다 가지고 와야됨
askSomeone1({ name: "디벨로퍼", skill: "웹 개발", age: 100 });