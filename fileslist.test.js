import { walkSync } from "./fileslist";

describe("test fileslist module", () => {
  test("walkSync should work when not passed directory param", () => {
    const generator = walkSync();
    expect(generator.next()).toEqual({ done: true, value: null });
  });
});
