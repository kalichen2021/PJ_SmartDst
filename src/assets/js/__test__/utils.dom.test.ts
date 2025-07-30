import { addPatternStyle, removePatternStyle } from "../utils";
import { expect, test } from "vitest";



test("addStyle", () => {
  const el = document.createElement("div");
  el.style.transform = "rotate(0deg) translate(0,0)";
  addPatternStyle(el, "transform", "scale(1,1) rotate(90deg) ");
  expect(el.style.transform).toBe("scale(1,1) rotate(90deg) translate(0,0)");
})

test("removeStyle", () => {
  const el = document.createElement("div");
  el.style.transform = "scale(1,1) rotate(90deg) translate(0,0)";
  removePatternStyle(el, "transform", ["rotate"]);
  expect(el.style.transform).toBe("scale(1,1) translate(0,0)");
})