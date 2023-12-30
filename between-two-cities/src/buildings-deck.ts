import { refCard, Card } from "@tabletop-playground/api";

function main2(obj: Card) {
  obj.shuffle()
  console.log("Buildings deck shuffled!");
  
  console.log(obj.getStackSize());
};

main2(refCard);