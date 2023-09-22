export function* hoveringSequence() {
  const seq: Array<number> = []; // (-2) 5개, (2) 10개, (-2) 5개
  for (let i = 0; i < 10; i++) {
    seq.push(-1);
  }
  for (let i = 0; i < 2; i++) {
    seq.push(0);
  }
  for (let i = 0; i < 20; i++) {
    seq.push(1);
  }
  for (let i = 0; i < 2; i++) {
    seq.push(0);
  }
  for (let i = 0; i < 10; i++) {
    seq.push(-1);
  }

  // let escape: boolean = false;

  const delay = Math.floor(Math.random() * 2) * 22;
  for (let i = 0; i < delay; i++) {
    yield 0;
  }

  while (true) {
    for (let v of seq) {
      // if (escape) return;

      yield v;
      // alert(escape);
    }
  }
}
