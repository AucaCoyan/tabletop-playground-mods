import { globalEvents, refCard, world } from "@tabletop-playground/api";

globalEvents.onObjectCreated.add(function (obj) {
  console.log("created an object ", obj.getId());
  // refCard.shuffle();
  world.broadcastChatMessage("Seatings deck shuffled!");
});
