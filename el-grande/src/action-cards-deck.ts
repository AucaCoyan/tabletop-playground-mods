import { refCard, Card } from "@tabletop-playground/api";

function main(obj: Card) {
    obj.shuffle()
    console.log("Action card deck shuffled!");
};

main(refCard);