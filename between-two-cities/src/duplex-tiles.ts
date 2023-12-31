import { refCard, Card } from "@tabletop-playground/api";

function main(obj: Card) {
  obj.shuffle()
  console.log("Duplex tiles deck shuffled!");
};

main(refCard);