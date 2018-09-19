
//  This is a Constructor function taking age and passport 
//  as the paramaters
function Person(age, passport) {
  this.age = age;
  this.passport = passport;
}
// Sets the age
// 
Person.prototype.setAge = function(age) {
    this.age = age;
};
// Checks whether the person is Adult based on the age
// 
Person.prototype.isAdult = function() {
    return this.age >= 18? true: false;
};
// Checks whether the person can have bank accounts 
// based on whether he/she is an adult
// 
Person.prototype.canHaveBankAccounts = function() {
    return this.isAdult()?true:false;
};
// Sets the passport status of the person
// 
Person.prototype.passportStatus = function(status) {
    this.passport = status;
};
// Checks whether the person has a passport
// 
Person.prototype.hasPassport = function() {
    return this.passport;
};
//  Sets the Person object to module.exports
// 
module.exports = Person;