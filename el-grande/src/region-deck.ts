import { refCard, Card, CardDetails } from "@tabletop-playground/api";
import { regionDeck } from "./world-constants";

function main(obj: Card) {
    obj.shuffle()
    console.log("Region card deck shuffled!");
};

export function drawRegion(): CardDetails {
    // get the first card
    console.log(regionDeck.getId())
    return regionDeck.getCardDetails()
}

main(refCard);