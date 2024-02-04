import { Card, GameObject, world } from "@tabletop-playground/api";

export const gameBoard: GameObject = world.getObjectById("game-board");
export const regionDeck: Card = world.getObjectById('region-deck');
