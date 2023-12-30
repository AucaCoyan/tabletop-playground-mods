import { refCard, Card } from "@tabletop-playground/api";

function main(obj: Card) {
  obj.shuffle()
  console.log("Seatings deck shuffled!");

  let selection = obj.takeCards()?.getCardDetails(1);
  console.log(selection);
  console.log(obj.getStackSize());
  
};

main(refCard);