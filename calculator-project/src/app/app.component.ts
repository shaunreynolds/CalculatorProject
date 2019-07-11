import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'My First Project - Calculator';

  // Default result text
resultText = '0';

// Default text to display in the operations window
operationText = "Waiting";
defaultOperationText = "Waiting";
previousKeyPress="";
allowedOperators=["+","-","/","*","."];

/**
 * Called on page load, registers the key listener for the keyboard input.
 * The call to bind is important to correctly transfer the scope of 'this'.
 */
ngOnInit(){
  document.addEventListener('keypress',this.onKeyUp.bind(this),false);
}

/**
 * Called every key stroke. Checks to see if the key is a valid one for the calculator, and calls pressKey accordingly.
 */
onKeyUp(event){

  // All keys allowed as input
  var allowedKeys = ["0","1","2","3","4","5","6","7","8","9","/","*","-","+"];

  // Get the character key value
  var key = String.fromCharCode(event.keyCode);

  // If it's allowed, enter it into the calculator
  if(allowedKeys.includes(key)){
    this.pressKey(key);
  }

  // If it's not allowed per se but is the Enter key, call pressKey('=')
  if(event.keyCode == 13){
    this.pressKey('=');
  }
}

/**
 * Called when a key is pressed on the calculator. Expects a string corresponding to the key pressed, 1-9 etc.
 * @param keyPressed a string representation of the key that was pressed on the calculator
 */
pressKey(keyPressed:string){

  switch(keyPressed){

    case '=':this.computeAnswer();break;
    case 'C':this.clearScreen();break;
    default:
    
    // Clears the little 'Waiting' message
    if(this.operationText===this.defaultOperationText){
      this.operationText="";
    }

    // If the key press was an operator, check the last pressed button. If that too was an operator, don't add it to
    // to the operations list. To prevent duplicate operators such as ++.
    if(!this.contains(this.allowedOperators,keyPressed) || !this.contains(this.allowedOperators,this.previousKeyPress)){
      
      this.operationText+=keyPressed;
    }

    // Remeber which key press was given
    this.previousKeyPress = keyPressed;
  }
}

/**
 * Iterates the given array looking for the given value.
 * @param arrayToSearch the array to search for the given value
 * @param value the value to search for
 */
private contains(arrayToSearch:Array<String>, value:string){
  for(var i = 0; i < arrayToSearch.length;i++){
    var s = arrayToSearch[i];
    console.log("Array value is: "+s+" looking for: "+value);
    if(s === value){
      return true;
    }
  }
  return false;
}

/**
 * Attempts to compute an answer from the buttons pressed.
 * Does not perform proper BIDMAS calculation, instead calculations are performed sequentially.
 * This could be overcome with better string tokenization.
 */
computeAnswer(){

  // This will store all the operands (numbers)
  var operandList = new Array();

  // This will store all the operators
  var operatorList = new Array();

  // Set the current operand (number) to a blank
  var currentOperand = "";

  // Split the contents of the operation text window at every character
  var operations = this.operationText.split("");

  // If the first character is a symbol, consider the previous result to be the first operand.
  // Otherwise, discard the previous result
  if(isNaN(parseFloat(operations[0])) && !isNaN(parseFloat(this.resultText))){
    currentOperand=this.resultText;
  }

  // Iterate each character. If the character is an operator, put the current operand in the list
  // and reset it to blank. If not, append the current character to the current operand.
  for(var i = 0; i < operations.length;i++){
    var currentChar = operations[i];
    switch(currentChar){
      case '+':operatorList.push(currentChar);operandList.push(currentOperand);currentOperand="";break;
      case '-':operatorList.push(currentChar);operandList.push(currentOperand);currentOperand="";break;
      case '/':operatorList.push(currentChar);operandList.push(currentOperand);currentOperand="";break;
      case '*':operatorList.push(currentChar);operandList.push(currentOperand);currentOperand="";break;
      default:currentOperand+=currentChar;break;
    }
  }

  // Add the last operand to the list
  operandList.push(currentOperand);

  // Storing the previous result allows for calculation chaining
  var result=0;
  for(var j = 0; j < operandList.length-1;j++){
    var leftOperand = operandList[j];
    if(j>0){

      // More than one operand, set the left operand to the previous calculation result for chaining
      leftOperand=result;
    }

    // Get the next operand and operator for this pair
    var rightOperand=operandList[j+1];
    var operator = operatorList[j];

    // Convert operands to numbers
    var leftOperandAsNum = parseFloat(leftOperand);
    var rightOperandAsNum=parseFloat(rightOperand);

    // Perform the calculation. Ideally operators would be classes to allow further expandablity
    // into more complex mathmetical operations
    switch(operator){
      case '+':result = leftOperandAsNum + rightOperandAsNum;break;
      case '-':result = leftOperandAsNum - rightOperandAsNum;break;
      case '*':result = leftOperandAsNum * rightOperandAsNum;break;
      case '/':result = leftOperandAsNum / rightOperandAsNum;break;
      default:break;
    }
  }

  var resultAsString = "";
  // If the output number is too long to display, convert to exponential and then display
  if(result.toString().length > 7){
    resultAsString = result.toExponential().toString();
  }else{
    resultAsString=result.toString();
  }
  this.resultText=resultAsString;
  this.operationText=this.defaultOperationText;
}

/**
 * Simply sets the resultText and operationText to their defaults.
 */
clearScreen(){
  this.resultText="0";
  this.operationText=this.defaultOperationText;
}



}
