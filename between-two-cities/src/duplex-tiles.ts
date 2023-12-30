import { refCard, Card } from "@tabletop-playground/api";

function main3(obj: Card) {
  obj.shuffle()
  console.log("Duplex tiles deck shuffled!");
  console.log(obj.getStackSize());
};

main3(refCard);