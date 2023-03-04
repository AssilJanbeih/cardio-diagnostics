import { FnParam } from "@angular/compiler/src/output/output_ast";

export function sumEvens(numStr) {
  let sum = 0;
  for (let i = 0; i < numStr.length; i++) {
    if (i % 2 === 0) {
      sum = sum + numStr[i];
    }
  }

  return sum * 3;
}
export function sumOdd(numStr) {
  let sum = 0;
  for (let i = 0; i < numStr.length; i++) {
    if (i % 2 !== 0) {
      sum = sum + numStr[i];
    }
  }
  return sum;
}

export function generateMemberShipGiftNumber(giftNumber: string) {
  let myFunc = (num) => Number(num);
  let intArr = Array.from(String(giftNumber), myFunc);
  let Total_1 = sumEvens(intArr) + sumOdd(intArr);
  const Total_2 = Math.floor(Total_1 / 10) + 1;
  const Total_3 = Total_2 * 10;
  let fnal_result = Total_3 - Total_1;
  return fnal_result;
}
