function TestClass(test)
{
     this.test = test;
}

TestClass.prototype = new Object();

TestClass.prototype.testMethod = function testMethod()
{
    console.log("testMethod: " + this.test);
}

function TestSubClass(subTest)
{
    TestClass(subTest);
}

TestSubClass.prototype = new TestClass();

TestSubClass.prototype.testSubMethod = function testSubMethod() {
    console.log("testSubMethod: " + this.test);
}

var testClass = new TestClass("a");

var testSub = new TestSubClass("b");

testClass.testMethod();
testSub.testSubMethod();
testSub.testMethod();

console.log(Object.getOwnPropertyNames('a'));

console.log(Object.getOwnPropertyNames(testClass));

console.log(testClass[].length);
console.log(testSub[].length);


