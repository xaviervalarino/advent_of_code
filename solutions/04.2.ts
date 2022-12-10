/*
 * Advent of Code
 * Day 4 - 2nd Solution
 * * * * * * * * * * * * * * *
 * w|!deno run --allow-read %
 */

import transformer from "../modules/transformer.ts";

interface Assignment {
  sections: number[];
  length: number;
}
transformer("./inputs/04.txt", async (cleanupAssignments) => {
  const groups = [];
  for await (const sectionAssignments of cleanupAssignments) {
    const group = sectionAssignments.split(",").map((sections) => {
      const assignment: Assignment = {
        sections: sections.split("-").map((section) => +section),
        length: 0,
      };
      assignment.length = assignment.sections[1] - assignment.sections[0];
      return assignment;
    });
    groups.push(group);
  }
  return groups
    .reduce((overlaps, group) => {
      // elf assignments
      const [shortest, longest] = group.sort((a, b) => a.length - b.length);
      const [a, b] = shortest.sections;
      const sectionsInLongest = (() => {
        const [first, last] = longest.sections;
        let current = first
        const sections = []
        while (!(current > last)) {
          sections.push(current)
          current++
        }
        return sections
      })();
      if (sectionsInLongest.indexOf(a) > -1 || sectionsInLongest.indexOf(b) > -1) {
        overlaps++;
      }
      return overlaps;
    }, 0)
    .toString();
});
