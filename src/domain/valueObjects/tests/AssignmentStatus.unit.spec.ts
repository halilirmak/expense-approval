import { describe, it, expect } from "vitest";
import { AssignmentStatus } from "../AssignmentStatus";

describe("AssignmentStatus", () => {
  it("creates an approved status", () => {
    const status = new AssignmentStatus("APPROVED");
    expect(status.isApproved()).toBe(true);
    expect(status.isRejected()).toBe(false);
    expect(status.toValue()).toBe("APPROVED");
  });

  it("creates a rejected status", () => {
    const status = new AssignmentStatus("REJECTED");
    expect(status.isApproved()).toBe(false);
    expect(status.isRejected()).toBe(true);
    expect(status.toValue()).toBe("REJECTED");
  });

  it("throws on invalid status", () => {
    const invalid = () => new AssignmentStatus("TEST_STATUS");
    expect(invalid).toThrowError(
      /Invalid status value for assignment: \(TEST_STATUS\)/,
    );
  });
});
