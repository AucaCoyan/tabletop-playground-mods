import { refCard, Card } from "@tabletop-playground/api";

function main(obj: Card) {
  obj.shuffle()
  console.log("Buildings deck shuffled!");
};

main(refCard);