import { world } from "@tabletop-playground/api";
import { drawSetup } from "./setup-game";

console.log("Loading the mod...")
// console.log("saved data: ", world.getSavedData(), "<")

function loadSave(): string | undefined {
    const dataStr = world.getSavedData();
    try {
        return JSON.parse(dataStr);
    } catch {
        return undefined;
    }
}

if (loadSave() == undefined) {
    world.broadcastChatMessage("--------------------------------------------------------------------");
    world.broadcastChatMessage("Welcome to El Grande!");
    world.broadcastChatMessage("");
    world.broadcastChatMessage("Please check the notes (right click / Notes) to know more about the mod");
    drawSetup();
}
