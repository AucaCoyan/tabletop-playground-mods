import { refCard, Card } from "@tabletop-playground/api";

function main(obj: Card) {
  obj.shuffle()
  console.log("Seatings deck shuffled!");
};

main(refCard);