export const topicsContent = [
  {
    id: "topic-py-1",
    language: "Python",
    title: "Variables and Data Types",
    category: "Basics",
    content: `
## Variables and Data Types in Python

### Variables
Variables are containers for storing data values. In Python, you don't need to declare the type.

\`\`\`python
name = "John"
age = 25
height = 5.9
is_student = True
\`\`\`

### Data Types

**1. Strings (str)**
- Text data enclosed in quotes
- Can use single, double, or triple quotes
\`\`\`python
name = "John"
message = 'Hello'
multiline = """This is
a multiline
string"""
\`\`\`

**2. Numbers**
- int: Whole numbers
- float: Decimal numbers
\`\`\`python
age = 25
price = 19.99
\`\`\`

**3. Boolean (bool)**
- True or False
\`\`\`python
is_active = True
is_deleted = False
\`\`\`

**4. None**
- Represents absence of value
\`\`\`python
value = None
\`\`\`

### Type Conversion
\`\`\`python
# String to int
num = int("123")

# Int to string
text = str(123)

# String to float
price = float("19.99")
\`\`\`

### Key Points
- Use meaningful variable names
- Python is dynamically typed
- Use type() to check data type
    `,
  },
  {
    id: "topic-py-2",
    language: "Python",
    title: "Control Flow: If/Else and Loops",
    category: "Control Flow",
    content: `
## Control Flow in Python

### If/Else Statements
\`\`\`python
age = 18

if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")
\`\`\`

### Comparison Operators
- ==: Equal to
- !=: Not equal to
- >: Greater than
- <: Less than
- >=: Greater than or equal to
- <=: Less than or equal to

### Logical Operators
- and: Both conditions must be true
- or: At least one condition must be true
- not: Negates the condition

\`\`\`python
age = 25
has_license = True

if age >= 18 and has_license:
    print("You can drive")
\`\`\`

### For Loops
\`\`\`python
# Loop through a range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Loop with index
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
\`\`\`

### While Loops
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

### Break and Continue
\`\`\`python
# Break: Exit the loop
for i in range(10):
    if i == 5:
        break
    print(i)

# Continue: Skip to next iteration
for i in range(5):
    if i == 2:
        continue
    print(i)
\`\`\`
    `,
  },
  {
    id: "topic-py-3",
    language: "Python",
    title: "Functions and Scope",
    category: "Functions",
    content: `
## Functions in Python

### Defining Functions
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("John"))  # Hello, John!
\`\`\`

### Parameters and Arguments
\`\`\`python
# Positional arguments
def add(a, b):
    return a + b

print(add(5, 3))  # 8

# Default arguments
def greet(name="Guest"):
    return f"Hello, {name}!"

print(greet())  # Hello, Guest!
print(greet("John"))  # Hello, John!

# Keyword arguments
print(add(b=3, a=5))  # 8
\`\`\`

### *args and **kwargs
\`\`\`python
# *args: Variable number of positional arguments
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs: Variable number of keyword arguments
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="John", age=25, city="NYC")
\`\`\`

### Scope
\`\`\`python
# Global scope
x = 10

def my_function():
    # Local scope
    y = 5
    print(x)  # Can access global x
    print(y)  # Can access local y

my_function()
print(x)  # 10
print(y)  # Error: y is not defined
\`\`\`

### Recursion
\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\`
    `,
  },
  {
    id: "topic-js-1",
    language: "JavaScript",
    title: "DOM Manipulation",
    category: "Web Development",
    content: `
## DOM Manipulation in JavaScript

### Selecting Elements
\`\`\`javascript
// By ID
const element = document.getElementById('myId');

// By class
const elements = document.getElementsByClassName('myClass');

// By tag
const divs = document.getElementsByTagName('div');

// Modern way (querySelector)
const element = document.querySelector('#myId');
const elements = document.querySelectorAll('.myClass');
\`\`\`

### Modifying Content
\`\`\`javascript
// Change text
element.textContent = "New text";

// Change HTML
element.innerHTML = "<p>New HTML</p>";

// Change attributes
element.setAttribute('class', 'new-class');
element.id = 'new-id';
\`\`\`

### Modifying Styles
\`\`\`javascript
// Inline styles
element.style.color = 'red';
element.style.fontSize = '20px';

// Add/remove classes
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('highlight');
\`\`\`

### Creating and Removing Elements
\`\`\`javascript
// Create element
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello';

// Add to DOM
document.body.appendChild(newDiv);

// Insert before
const parent = document.getElementById('parent');
const newElement = document.createElement('p');
parent.insertBefore(newElement, parent.firstChild);

// Remove element
element.remove();
parent.removeChild(element);
\`\`\`

### Event Listeners
\`\`\`javascript
// Add event listener
button.addEventListener('click', function() {
    console.log('Button clicked');
});

// Remove event listener
button.removeEventListener('click', handleClick);

// Common events
- click
- change
- submit
- keydown
- mouseover
- focus
- blur
\`\`\`
    `,
  },
  {
    id: "topic-js-2",
    language: "JavaScript",
    title: "Promises and Async/Await",
    category: "Asynchronous",
    content: `
## Promises and Async/Await

### Promises
A Promise represents the eventual completion of an asynchronous operation.

\`\`\`javascript
// Creating a promise
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Success!');
    }, 1000);
});

// Using a promise
myPromise
    .then(result => console.log(result))
    .catch(error => console.error(error));
\`\`\`

### Promise States
- Pending: Initial state
- Fulfilled: Operation completed successfully
- Rejected: Operation failed

### Promise Methods
\`\`\`javascript
// Promise.all: Wait for all promises
Promise.all([promise1, promise2, promise3])
    .then(results => console.log(results));

// Promise.race: Return first completed promise
Promise.race([promise1, promise2])
    .then(result => console.log(result));
\`\`\`

### Async/Await
\`\`\`javascript
// Async function
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Using async function
fetchData().then(data => console.log(data));
\`\`\`

### Error Handling
\`\`\`javascript
// With promises
fetch('/api/data')
    .then(response => response.json())
    .catch(error => console.error('Error:', error));

// With async/await
async function getData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
\`\`\`
    `,
  },
  {
    id: "topic-js-3",
    language: "JavaScript",
    title: "Array Methods",
    category: "Arrays",
    content: `
## Array Methods in JavaScript

### Iteration Methods

**map()**: Transform each element
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
// [2, 4, 6, 8, 10]
\`\`\`

**filter()**: Keep elements that match condition
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(num => num % 2 === 0);
// [2, 4]
\`\`\`

**reduce()**: Accumulate values
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
// 15
\`\`\`

**forEach()**: Execute function for each element
\`\`\`javascript
const numbers = [1, 2, 3];
numbers.forEach(num => console.log(num));
\`\`\`

### Search Methods

**find()**: Return first element matching condition
\`\`\`javascript
const users = [{id: 1, name: 'John'}, {id: 2, name: 'Jane'}];
const user = users.find(u => u.id === 1);
\`\`\`

**findIndex()**: Return index of first match
\`\`\`javascript
const index = users.findIndex(u => u.id === 1);
\`\`\`

**includes()**: Check if array contains value
\`\`\`javascript
const numbers = [1, 2, 3];
console.log(numbers.includes(2));  // true
\`\`\`

### Modification Methods

**push()**: Add to end
\`\`\`javascript
const arr = [1, 2, 3];
arr.push(4);  // [1, 2, 3, 4]
\`\`\`

**pop()**: Remove from end
\`\`\`javascript
arr.pop();  // [1, 2, 3]
\`\`\`

**slice()**: Create new array (non-destructive)
\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
const sliced = arr.slice(1, 3);  // [2, 3]
\`\`\`

**splice()**: Modify array (destructive)
\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
arr.splice(1, 2, 'a', 'b');  // [1, 'a', 'b', 4, 5]
\`\`\`
    `,
  },
]
