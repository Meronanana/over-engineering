import { Food } from "./abstractItem";
import { TURN_TIME } from "./constants";
import { FoodType, MapPosition, Turn } from "./types";

export class Apple extends Food {
  foodType = FoodType.APPLE;
  numOfSprite: number = 4;

  constructor(turnForDecay: Turn, position: MapPosition) {
    super(turnForDecay, position);

    this.spriteIndexGenerator = (function* (my: Apple) {
      while (true) {
        yield 0;
      }
    })(this);

    // 턴 당 turnForDecay 값 감소
    const decTurnForDecay = setInterval(() => {
      if (this.turnForDecay === 0) {
        this.delete = true;
        clearInterval(decTurnForDecay);
        return;
      }
      this.turnForDecay -= 1;
    }, TURN_TIME);
  }

  override getSupply(): number {
    return 20;
  }
}
