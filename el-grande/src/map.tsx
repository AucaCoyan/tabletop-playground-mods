import { Zone } from "@tabletop-playground/api";
import { gameBoard } from "./world-constants";

// let galiciaZone = new Zone();


const gameBoardRegions = {
    space: {
        Antarctica: gameBoard.getSnapPoint(15),
        Arkham: gameBoard.getSnapPoint(29),
        "Buenos Aires": gameBoard.getSnapPoint(34)
    }
}
