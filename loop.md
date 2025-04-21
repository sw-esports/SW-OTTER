### JavaScript Loop Practice: while, do-while, and for


---

A. while Loop Questions

1. Print numbers from 1 to 10

Logic: Initialize a counter and increment it until it reaches 10.
Example:

let i = 1;
while (i <= 10) {
    console.log(i);
    i++;
}

2. Print even numbers between 1 and 20

Logic: Use a counter and check if the number is divisible by 2.
Example:

let i = 1;
while (i <= 20) {
    if (i % 2 === 0) console.log(i);
    i++;
}

3. Find the sum of digits of a number

Logic: Use modulo and division to extract and sum digits.
Example:

let num = 1234, sum = 0;
while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
}
console.log(sum);

4. Reverse a number

Logic: Extract digits using modulo and rebuild the number in reverse.
Example:

let num = 1234, rev = 0;
while (num > 0) {
    rev = rev * 10 + (num % 10);
    num = Math.floor(num / 10);
}
console.log(rev);

5. Check if a number is prime

Logic: Check divisibility from 2 to n-1.
Example:

let n = 7, i = 2, isPrime = true;
while (i < n) {
    if (n % i === 0) {
        isPrime = false;
        break;
    }
    i++;
}
console.log(isPrime);


---

B. do-while Loop Questions

1. Print numbers from 1 to 5

Logic: Use a counter and run at least once.
Example:

let i = 1;
do {
    console.log(i);
    i++;
} while (i <= 5);

2. Print squares of numbers from 1 to 10

Logic: Multiply the number by itself and loop until 10.
Example:

let i = 1;
do {
    console.log(i * i);
    i++;
} while (i <= 10);

3. Multiplication table of a number

Logic: Multiply the number from 1 to 10.
Example:

let num = 5, i = 1;
do {
    console.log(`${num} x ${i} = ${num * i}`);
    i++;
} while (i <= 10);

4. Display menu until user exits (simulate)

Logic: Use prompt to get user choice repeatedly.
Example:

let choice;
do {
    choice = prompt("Enter 1 to continue, 0 to exit:");
    console.log("You chose:", choice);
} while (choice != 0);

5. Input numbers until 0, display sum (simulate)

Logic: Use prompt to collect and sum values.
Example:

let sum = 0, input;
do {
    input = parseInt(prompt("Enter number (0 to stop):"));
    sum += input;
} while (input !== 0);
console.log("Sum:", sum);


---

C. for Loop Questions

1. Print numbers from 1 to 100

Logic: Loop from 1 to 100 and print.
Example:

for (let i = 1; i <= 100; i++) {
    console.log(i);
}

2. Factorial of a number

Logic: Multiply from 1 to n.
Example:

let n = 5, fact = 1;
for (let i = 1; i <= n; i++) {
    fact *= i;
}
console.log(fact);

3. Fibonacci series up to n terms

Logic: Add two previous terms to get next.
Example:

let n = 10, a = 0, b = 1;
for (let i = 0; i < n; i++) {
    console.log(a);
    let next = a + b;
    a = b;
    b = next;
}

4. Print odd numbers from 50 to 100

Logic: Check if number is odd and print.
Example:

for (let i = 50; i <= 100; i++) {
    if (i % 2 !== 0) console.log(i);
}

5. Sum of even numbers from 1 to 50

Logic: Check if even, then add to sum.
Example:

let sum = 0;
for (let i = 1; i <= 50; i++) {
    if (i % 2 === 0) sum += i;
}
console.log(sum);


---

End of Practice Questions

