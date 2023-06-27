import { findDeskproLabel } from "../findDeskproLabel";

const dpLabel = { id: "001", idBoard: "board001", name: "Deskpro", color: "blue" };
const labels = [
  { id: "002", idBoard: "board001", name: "No color", color: null },
  { id: "003", idBoard: "board002", name: "", color: "orange" },
  { id: "004", idBoard: "board001", name: "", color: "purple" },
];

describe("getProjectName", () => {
  test("should return deskpro label", () => {
    expect(findDeskproLabel({ labels: [...labels, dpLabel ] } as never)).toEqual(dpLabel);
  });

  test("should return undefined if the label not found", () => {
    expect(findDeskproLabel(labels as never)).toBeUndefined();
  });

  test.each(
    [undefined, null, "", 0, true, false, {}, []]
  )("should return undefined if wrong value: %p", (value) => {
    expect(findDeskproLabel(value as never)).toBeUndefined();
  });
});
