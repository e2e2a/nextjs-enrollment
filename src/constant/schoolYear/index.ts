export const SchoolYear = [
  ...Array.from({ length: 36 }, (_, i) => {
    const startYear = 1999 + i;
    const endYear = startYear + 1;
    return {
      title: `sy${startYear}-${endYear}`,
      value: `sy${startYear}-${endYear}`,
    };
  }),
];
