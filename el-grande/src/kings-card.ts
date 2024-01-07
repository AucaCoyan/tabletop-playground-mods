import {Card, refCard} from '@tabletop-playground/api';

function main(obj:Card) {
    // sleep 1s    
    setTimeout(() => {
        obj.flipOrUpright()
    }, 1000);
}

main(refCard)
