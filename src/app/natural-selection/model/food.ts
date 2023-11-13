import { Food } from "./abstractItem";
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
  }

  override getSupply(): number {
    return 5;
  }
}
