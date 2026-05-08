export const interviewQuestions = [
  {
    id: "int-1",
    title: "What is the difference between let, const, and var?",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Easy",
    answer: `
var: Function-scoped, can be redeclared and updated, hoisted with undefined.
let: Block-scoped, cannot be redeclared, can be updated, hoisted but not initialized.
const: Block-scoped, cannot be redeclared or updated, hoisted but not initialized.

Example:
var x = 1;
let y = 2;
const z = 3;

x = 10; // OK
y = 20; // OK
z = 30; // Error: Assignment to constant variable
    `,
    followUp: "When would you use each one?",
  },
  {
    id: "int-2",
    title: "Explain closures in JavaScript",
    language: "JavaScript",
    category: "Advanced",
    difficulty: "Medium",
    answer: `
A closure is a function that has access to variables from its outer scope even after the outer function has returned.

Example:
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  }
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2

The inner function "closes over" the count variable.
    `,
    followUp: "What are practical use cases for closures?",
  },
  {
    id: "int-3",
    title: "What is the event loop?",
    language: "JavaScript",
    category: "Advanced",
    difficulty: "Hard",
    answer: `
The event loop is a mechanism that allows JavaScript to perform non-blocking operations.

It works in this order:
1. Execute synchronous code (call stack)
2. When call stack is empty, check the microtask queue (Promises, async/await)
3. Execute all microtasks
4. Check the macrotask queue (setTimeout, setInterval)
5. Execute one macrotask
6. Repeat from step 2

Example:
console.log('Start');
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('End');

Output:
Start
End
Promise
Timeout
    `,
    followUp: "What's the difference between microtasks and macrotasks?",
  },
  {
    id: "int-4",
    title: "Explain async/await",
    language: "JavaScript",
    category: "Asynchronous",
    difficulty: "Medium",
    answer: `
async/await is syntactic sugar for working with Promises.

async: Declares an asynchronous function that always returns a Promise.
await: Pauses execution until a Promise is resolved.

Example:
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

Benefits:
- Cleaner, more readable code
- Easier error handling with try/catch
- Looks like synchronous code
    `,
    followUp: "How would you handle multiple async operations in parallel?",
  },
  {
    id: "int-5",
    title: "What is the difference between == and ===?",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Easy",
    answer: `
==: Loose equality, performs type coercion
===: Strict equality, no type coercion

Examples:
5 == '5'   // true (type coercion)
5 === '5'  // false (different types)

0 == false   // true
0 === false  // false

null == undefined   // true
null === undefined  // false

Best practice: Always use === to avoid unexpected behavior.
    `,
    followUp: "Can you give more examples of type coercion?",
  },
  {
    id: "int-6",
    title: "Explain the 'this' keyword",
    language: "JavaScript",
    category: "Advanced",
    difficulty: "Medium",
    answer: `
'this' refers to the object that is executing the current function.

Context depends on how the function is called:

1. Global context: 'this' refers to the global object (window in browsers)
2. Object method: 'this' refers to the object
3. Constructor: 'this' refers to the new object being created
4. Arrow function: 'this' is inherited from the enclosing scope

Example:
const obj = {
  name: 'John',
  greet: function() {
    console.log(this.name); // 'John'
  },
  greetArrow: () => {
    console.log(this.name); // undefined (inherits from global)
  }
}

obj.greet();      // 'John'
obj.greetArrow(); // undefined
    `,
    followUp: "How can you explicitly set 'this'?",
  },
  {
    id: "int-7",
    title: "What is hoisting?",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Medium",
    answer: `
Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution.

var: Hoisted and initialized with undefined
let/const: Hoisted but not initialized (Temporal Dead Zone)
Functions: Fully hoisted

Example:
console.log(x); // undefined (not an error)
var x = 5;

console.log(y); // ReferenceError
let y = 10;

sayHi(); // Works fine
function sayHi() {
  console.log('Hi');
}
    `,
    followUp: "What is the Temporal Dead Zone?",
  },
  {
    id: "int-8",
    title: "Explain prototypal inheritance",
    language: "JavaScript",
    category: "Advanced",
    difficulty: "Hard",
    answer: `
JavaScript uses prototypal inheritance where objects inherit directly from other objects.

Every object has a prototype, and it looks up the prototype chain to find properties/methods.

Example:
const parent = {
  greet() {
    return 'Hello';
  }
};

const child = Object.create(parent);
child.name = 'John';

console.log(child.greet()); // 'Hello' (inherited from parent)

Prototype chain:
child -> parent -> Object.prototype -> null

Modern approach using classes:
class Parent {
  greet() {
    return 'Hello';
  }
}

class Child extends Parent {
  constructor(name) {
    super();
    this.name = name;
  }
}
    `,
    followUp: "What's the difference between __proto__ and prototype?",
  },
  {
    id: "int-9",
    title: "What is a callback function?",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Easy",
    answer: `
A callback is a function passed as an argument to another function, which is then invoked inside the outer function.

Example:
function greet(name, callback) {
  console.log('Hello ' + name);
  callback();
}

function sayGoodbye() {
  console.log('Goodbye');
}

greet('John', sayGoodbye);
// Output:
// Hello John
// Goodbye

Common uses:
- Event handlers
- Array methods (map, filter, forEach)
- Asynchronous operations (before Promises)

Callback Hell (Pyramid of Doom):
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        // Deeply nested
      });
    });
  });
});

Solution: Use Promises or async/await
    `,
    followUp: "What is callback hell and how do you avoid it?",
  },
  {
    id: "int-10",
    title: "What are Python decorators?",
    language: "Python",
    category: "Advanced",
    difficulty: "Hard",
    answer: `
A decorator is a function that modifies or enhances another function or class without permanently changing it.

Syntax:
@decorator
def function():
    pass

Example:
def my_decorator(func):
    def wrapper():
        print("Something before the function")
        func()
        print("Something after the function")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# Output:
# Something before the function
# Hello!
# Something after the function

With arguments:
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before")
        result = func(*args, **kwargs)
        print("After")
        return result
    return wrapper

Common decorators:
- @property: Convert method to property
- @staticmethod: Define static method
- @classmethod: Define class method
    `,
    followUp: "How would you create a decorator that takes arguments?",
  },
  {
    id: "int-11",
    title: "Explain list comprehension in Python",
    language: "Python",
    category: "Fundamentals",
    difficulty: "Medium",
    answer: `
List comprehension is a concise way to create lists in Python.

Syntax: [expression for item in iterable if condition]

Examples:
# Simple
squares = [x**2 for x in range(5)]
# [0, 1, 4, 9, 16]

# With condition
evens = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# Nested
matrix = [[i*j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]

# String manipulation
words = ['hello', 'world']
upper_words = [word.upper() for word in words]
# ['HELLO', 'WORLD']

Benefits:
- More readable and concise
- Generally faster than loops
- Functional programming style
    `,
    followUp: "What's the difference between list, dict, and set comprehension?",
  },
  {
    id: "int-12",
    title: "What is the difference between mutable and immutable?",
    language: "Python",
    category: "Fundamentals",
    difficulty: "Easy",
    answer: `
Mutable: Can be changed after creation
Immutable: Cannot be changed after creation

Mutable types:
- list: [1, 2, 3]
- dict: {'key': 'value'}
- set: {1, 2, 3}

Immutable types:
- tuple: (1, 2, 3)
- string: 'hello'
- int, float, bool
- frozenset

Example:
# Mutable
lst = [1, 2, 3]
lst[0] = 10  # OK
lst.append(4)  # OK

# Immutable
tup = (1, 2, 3)
tup[0] = 10  # Error: 'tuple' object does not support item assignment

# String
s = 'hello'
s[0] = 'H'  # Error: 'str' object does not support item assignment
s = 'Hello'  # OK (creates new string)

Implications:
- Immutable objects can be used as dictionary keys
- Mutable objects cannot be dictionary keys
- Immutable objects are thread-safe
    `,
    followUp: "Why would you use immutable objects?",
  },
  {
    id: "int-13",
    title: "What is a Promise?",
    language: "JavaScript",
    category: "Asynchronous",
    difficulty: "Medium",
    answer: `
A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.

States:
- Pending: Initial state
- Fulfilled: Operation completed successfully
- Rejected: Operation failed

Example:
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

promise.then(result => console.log(result));

Promise methods:
- Promise.all(): Wait for all promises
- Promise.race(): Return first completed promise
- Promise.allSettled(): Wait for all to settle
- Promise.any(): Return first fulfilled promise
    `,
    followUp: "What's the difference between Promise.all and Promise.race?",
  },
  {
    id: "int-14",
    title: "What is the difference between null and undefined?",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Easy",
    answer: `
null: Intentionally set to represent "no value"
undefined: Default value for uninitialized variables

Examples:
let x;
console.log(x); // undefined

let y = null;
console.log(y); // null

typeof undefined; // "undefined"
typeof null; // "object" (quirk in JavaScript)

null == undefined; // true
null === undefined; // false

When to use:
- Use undefined for uninitialized variables
- Use null to explicitly set "no value"
    `,
    followUp: "Why does typeof null return 'object'?",
  },
  {
    id: "int-15",
    title: "Explain the spread operator",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Medium",
    answer: `
The spread operator (...) allows an iterable to be expanded in places where zero or more elements are expected.

Array spreading:
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

Object spreading:
const obj1 = {a: 1, b: 2};
const obj2 = {...obj1, c: 3}; // {a: 1, b: 2, c: 3}

Function arguments:
function sum(a, b, c) {
  return a + b + c;
}
const numbers = [1, 2, 3];
sum(...numbers); // 6

Rest parameters (opposite):
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b);
}
sum(1, 2, 3); // 6
    `,
    followUp: "What's the difference between spread and rest?",
  },
  {
    id: "int-16",
    title: "What is destructuring?",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Medium",
    answer: `
Destructuring allows unpacking values from arrays or properties from objects into distinct variables.

Array destructuring:
const [a, b, c] = [1, 2, 3];
console.log(a); // 1

const [x, , z] = [1, 2, 3]; // Skip middle
console.log(x, z); // 1, 3

Object destructuring:
const {name, age} = {name: 'John', age: 30};
console.log(name); // 'John'

Renaming:
const {name: personName} = {name: 'John'};
console.log(personName); // 'John'

Default values:
const {name = 'Unknown'} = {};
console.log(name); // 'Unknown'

Nested destructuring:
const {user: {name}} = {user: {name: 'John'}};
console.log(name); // 'John'
    `,
    followUp: "How would you destructure nested objects?",
  },
  {
    id: "int-17",
    title: "What is a template literal?",
    language: "JavaScript",
    category: "Fundamentals",
    difficulty: "Easy",
    answer: `
Template literals are strings that allow embedded expressions using backticks (\`).

Basic syntax:
const name = 'John';
const greeting = \`Hello, \${name}!\`;
console.log(greeting); // Hello, John!

Multi-line strings:
const text = \`
  Line 1
  Line 2
  Line 3
\`;

Expressions:
const a = 5;
const b = 10;
console.log(\`\${a} + \${b} = \${a + b}\`); // 5 + 10 = 15

Tagged templates:
function tag(strings, ...values) {
  return strings[0] + values[0].toUpperCase() + strings[1];
}
const name = 'john';
tag\`Hello \${name}!\`; // Hello JOHN!
    `,
    followUp: "What are tagged templates used for?",
  },
  {
    id: "int-18",
    title: "What is the difference between map and forEach?",
    language: "JavaScript",
    category: "Arrays",
    difficulty: "Medium",
    answer: `
map: Returns a new array with transformed elements
forEach: Executes a function for each element, returns undefined

Example:
const arr = [1, 2, 3];

// map
const doubled = arr.map(x => x * 2);
console.log(doubled); // [2, 4, 6]

// forEach
arr.forEach(x => console.log(x * 2));
// Logs: 2, 4, 6

Key differences:
- map returns a new array, forEach returns undefined
- map can be chained, forEach cannot
- map is functional, forEach is imperative
- forEach is better for side effects
- map is better for transformations

When to use:
- Use map when you need to transform data
- Use forEach when you need side effects
    `,
    followUp: "What other array methods do you know?",
  },
  {
    id: "int-19",
    title: "Explain the filter method",
    language: "JavaScript",
    category: "Arrays",
    difficulty: "Easy",
    answer: `
filter creates a new array with elements that pass a test.

Syntax:
array.filter(callback(element, index, array))

Example:
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4, 6]

More examples:
const users = [
  {name: 'John', age: 25},
  {name: 'Jane', age: 30},
  {name: 'Bob', age: 20}
];

const adults = users.filter(user => user.age >= 21);
// [{name: 'John', age: 25}, {name: 'Jane', age: 30}]

Chaining:
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 2)
  .reduce((a, b) => a + b);
    `,
    followUp: "How would you filter nested arrays?",
  },
  {
    id: "int-20",
    title: "Explain the reduce method",
    language: "JavaScript",
    category: "Arrays",
    difficulty: "Medium",
    answer: `
reduce executes a reducer function on each element, resulting in a single value.

Syntax:
array.reduce(callback(accumulator, currentValue, index, array), initialValue)

Example:
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

More examples:
// Product
const product = numbers.reduce((acc, num) => acc * num, 1);
// 120

// Grouping
const words = ['apple', 'banana', 'apple', 'cherry', 'banana'];
const count = words.reduce((acc, word) => {
  acc[word] = (acc[word] || 0) + 1;
  return acc;
}, {});
// {apple: 2, banana: 2, cherry: 1}

// Flattening
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => acc.concat(arr), []);
// [1, 2, 3, 4, 5, 6]
    `,
    followUp: "What are practical use cases for reduce?",
  },
  {
    id: "int-21",
    title: "What is a lambda function?",
    language: "Python",
    category: "Fundamentals",
    difficulty: "Easy",
    answer: `
A lambda function is a small anonymous function defined with the lambda keyword.

Syntax:
lambda arguments: expression

Example:
square = lambda x: x ** 2
print(square(5)) # 25

With multiple arguments:
add = lambda x, y: x + y
print(add(3, 5)) # 8

Common uses:
# With map
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
# [1, 4, 9, 16, 25]

# With filter
evens = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4]

# With sorted
students = [('John', 25), ('Jane', 20), ('Bob', 23)]
sorted_students = sorted(students, key=lambda x: x[1])
# [('Jane', 20), ('Bob', 23), ('John', 25)]

Limitations:
- Can only contain a single expression
- Cannot contain statements
- Use regular functions for complex logic
    `,
    followUp: "When would you use lambda vs regular functions?",
  },
  {
    id: "int-22",
    title: "What is a generator in Python?",
    language: "Python",
    category: "Advanced",
    difficulty: "Hard",
    answer: `
A generator is a function that returns an iterator using yield instead of return.

Example:
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

for num in count_up_to(5):
    print(num)
# Output: 1, 2, 3, 4, 5

Benefits:
- Memory efficient (lazy evaluation)
- Can represent infinite sequences
- Cleaner code for iterators

Generator expression:
squares = (x ** 2 for x in range(5))
print(next(squares)) # 0
print(next(squares)) # 1

Fibonacci generator:
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
for _ in range(5):
    print(next(fib))
# Output: 0, 1, 1, 2, 3

Generator methods:
- send(): Send value to generator
- throw(): Throw exception in generator
- close(): Stop generator
    `,
    followUp: "What's the difference between yield and return?",
  },
  {
    id: "int-23",
    title: "Explain *args and **kwargs",
    language: "Python",
    category: "Fundamentals",
    difficulty: "Medium",
    answer: `
*args: Allows function to accept variable number of positional arguments
**kwargs: Allows function to accept variable number of keyword arguments

*args example:
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5)) # 15

**kwargs example:
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name='John', age=30, city='NYC')
# Output:
# name: John
# age: 30
# city: NYC

Combined:
def function(a, b, *args, **kwargs):
    print(f"a: {a}, b: {b}")
    print(f"args: {args}")
    print(f"kwargs: {kwargs}")

function(1, 2, 3, 4, name='John', age=30)
# Output:
# a: 1, b: 2
# args: (3, 4)
# kwargs: {'name': 'John', 'age': 30}

Unpacking:
def add(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
print(add(*numbers)) # 6

params = {'a': 1, 'b': 2, 'c': 3}
print(add(**params)) # 6
    `,
    followUp: "When would you use *args vs **kwargs?",
  },
  {
    id: "int-24",
    title: "What is a context manager?",
    language: "Python",
    category: "Advanced",
    difficulty: "Hard",
    answer: `
A context manager is an object that defines what happens when entering and exiting a with block.

Using context managers:
with open('file.txt') as f:
    content = f.read()
# File is automatically closed

Creating context managers:
class MyContext:
    def __enter__(self):
        print("Entering")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Exiting")
        return False

with MyContext() as ctx:
    print("Inside")
    `,
    followUp: "How would you create a context manager using contextlib?",
  },
  {
    id: "int-25",
    title: "What is the difference between JDK, JRE, and JVM?",
    language: "Java",
    category: "Fundamentals",
    difficulty: "Easy",
    answer: `
JDK (Java Development Kit): Complete development environment including compiler, debugger, and tools.
JRE (Java Runtime Environment): Runtime environment for executing Java applications.
JVM (Java Virtual Machine): Engine that executes Java bytecode.

Relationship:
JDK = JRE + Development Tools (javac, javadoc)
JRE = JVM + Libraries
JVM = Execution Engine

Example:
- Write code in .java file
- Compile with javac (JDK) → .class file
- Execute with java (JRE uses JVM) → Run program
    `,
    followUp: "What is bytecode and why is it important?",
  },
  {
    id: "int-26",
    title: "Explain OOP principles in Java",
    language: "Java",
    category: "OOP",
    difficulty: "Medium",
    answer: `
Four main principles:

1. Encapsulation: Bundling data and methods
   class Person {
       private String name;
       public String getName() { return name; }
   }

2. Inheritance: Child class inherits from parent
   class Student extends Person { }

3. Polymorphism: Same method, different behaviors
   - Compile-time (overloading)
   - Runtime (overriding)

4. Abstraction: Hiding implementation details
   abstract class Shape {
       abstract void draw();
   }
    `,
    followUp: "What's the difference between abstract classes and interfaces?",
  },
  {
    id: "int-27",
    title: "What is method overloading vs overriding?",
    language: "Java",
    category: "OOP",
    difficulty: "Medium",
    answer: `
Overloading: Same method name, different parameters (compile-time)
Overriding: Subclass provides specific implementation (runtime)

Overloading:
class Calculator {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}

Overriding:
class Animal {
    void sound() { System.out.println("Animal sound"); }
}
class Dog extends Animal {
    @Override
    void sound() { System.out.println("Bark"); }
}
    `,
    followUp: "Can you override static methods?",
  },
  {
    id: "int-28",
    title: "What are pointers in C++?",
    language: "C++",
    category: "Memory Management",
    difficulty: "Medium",
    answer: `
A pointer is a variable that stores the memory address of another variable.

Declaration:
int *ptr;        // Pointer to int
int value = 10;
ptr = &value;    // Store address of value

Dereferencing:
cout << *ptr;    // Access value at address (10)

Pointer arithmetic:
int arr[] = {1, 2, 3};
int *p = arr;
cout << *(p + 1); // 2

Null pointer:
int *ptr = nullptr;

Types:
- Wild pointer: Uninitialized
- Dangling pointer: Points to deleted memory
- Void pointer: Can point to any type
    `,
    followUp: "What's the difference between pointers and references?",
  },
  {
    id: "int-29",
    title: "Explain RAII in C++",
    language: "C++",
    category: "Memory Management",
    difficulty: "Hard",
    answer: `
RAII (Resource Acquisition Is Initialization): Resources are acquired in constructor and released in destructor.

Example:
class FileHandler {
    FILE* file;
public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
    }
    ~FileHandler() {
        if (file) fclose(file);
    }
};

void process() {
    FileHandler fh("data.txt");
    // Use file
} // Automatically closed

Smart pointers:
std::unique_ptr<int> ptr = std::make_unique<int>(10);
// Automatically deleted

Benefits:
- Exception safety
- No memory leaks
- Automatic cleanup
    `,
    followUp: "What are smart pointers and their types?",
  },
  {
    id: "int-30",
    title: "What are goroutines in Go?",
    language: "Go",
    category: "Concurrency",
    difficulty: "Medium",
    answer: `
Goroutines are lightweight threads managed by Go runtime.

Creating goroutines:
go function()
go func() {
    fmt.Println("Hello from goroutine")
}()

Comparison:
- Goroutines: ~2KB stack
- OS threads: ~1MB stack

Example:
func worker(id int) {
    fmt.Printf("Worker %d starting\\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d done\\n", id)
}

func main() {
    for i := 1; i <= 5; i++ {
        go worker(i)
    }
    time.Sleep(2 * time.Second)
}
    `,
    followUp: "How do you communicate between goroutines?",
  },
  {
    id: "int-31",
    title: "Explain channels in Go",
    language: "Go",
    category: "Concurrency",
    difficulty: "Hard",
    answer: `
Channels are pipes for goroutines to communicate and synchronize.

Creating channels:
ch := make(chan int)        // Unbuffered
ch := make(chan int, 10)    // Buffered

Sending and receiving:
ch <- value    // Send
value := <-ch  // Receive

Example:
func sum(nums []int, ch chan int) {
    total := 0
    for _, num := range nums {
        total += num
    }
    ch <- total
}

func main() {
    nums := []int{1, 2, 3, 4, 5}
    ch := make(chan int)
    go sum(nums[:3], ch)
    go sum(nums[3:], ch)
    x, y := <-ch, <-ch
    fmt.Println(x + y)
}

Channel operations:
- close(ch): Close channel
- for val := range ch: Iterate
- select: Wait on multiple channels
    `,
    followUp: "What's the difference between buffered and unbuffered channels?",
  },
  {
    id: "int-32",
    title: "What is ownership in Rust?",
    language: "Rust",
    category: "Memory Management",
    difficulty: "Hard",
    answer: `
Ownership is Rust's memory management system without garbage collection.

Rules:
1. Each value has one owner
2. Only one owner at a time
3. Value dropped when owner goes out of scope

Example:
let s1 = String::from("hello");
let s2 = s1;  // s1 moved to s2
// println!("{}", s1); // Error: s1 no longer valid

Clone to copy:
let s1 = String::from("hello");
let s2 = s1.clone();
println!("{} {}", s1, s2); // OK

Function ownership:
fn takes_ownership(s: String) {
    println!("{}", s);
} // s dropped here

let s = String::from("hello");
takes_ownership(s);
// println!("{}", s); // Error: s moved
    `,
    followUp: "What are borrowing and references?",
  },
  {
    id: "int-33",
    title: "What are blocks, procs, and lambdas in Ruby?",
    language: "Ruby",
    category: "Advanced",
    difficulty: "Hard",
    answer: `
All are ways to pass code as objects.

Blocks: Anonymous functions passed to methods
[1, 2, 3].each { |num| puts num }

Procs: Objects that hold blocks
my_proc = Proc.new { |x| x * 2 }
my_proc.call(5) # 10

Lambdas: Special procs with stricter argument checking
my_lambda = lambda { |x| x * 2 }
my_lambda.call(5) # 10

Differences:
- Lambda checks argument count, proc doesn't
- Lambda returns from lambda, proc returns from method

def test_return
  my_proc = Proc.new { return "proc" }
  my_proc.call
  return "method"
end

def test_lambda
  my_lambda = lambda { return "lambda" }
  my_lambda.call
  return "method"
end

puts test_return # Outputs "proc"
puts test_lambda # Outputs "method"
    `,
    followUp: "What are the differences between blocks, procs, and lambdas?",
  },
]
