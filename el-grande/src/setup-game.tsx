import { Button, Player, ScreenUIElement, world } from "@tabletop-playground/api";
import { drawRegion } from "./region-deck";
import { jsxInTTPG, render } from "jsx-in-ttpg";

export function drawSetup() {
    const WIDTH = 180;
    const HEIGHT = 60;
    const BORDER_SIZE = 2;

    const my_jsx_button = new ScreenUIElement();
    my_jsx_button.anchorX = 0.5;
    my_jsx_button.anchorY = 0.5;
    my_jsx_button.relativePositionX = true
    my_jsx_button.relativePositionY = true
    my_jsx_button.positionX = 0.5
    my_jsx_button.height = HEIGHT
    my_jsx_button.width = WIDTH
    my_jsx_button.positionY = 0.1

    my_jsx_button.widget = render(
        <border color={[1, 1, 1, 1]}>
            <layout padding={BORDER_SIZE}>
                <button bold={true} onClick={setupGame}>Start</button>
            </layout>
        </border>
    );

    world.addScreenUI(my_jsx_button);
}

function setupGame(button: Button, player: Player): void {
    console.log("working on the setup")
    // console.log(regionDeck.getCardDetails().name)
    let someregion = drawRegion();
    console.log(someregion);
}