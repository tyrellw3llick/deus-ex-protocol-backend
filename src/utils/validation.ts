export const contentValidator = {
  noMaliciousContent: (content: string): boolean => {
    return (
      // No script tags
      !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content) &&
      // No Mongo operators
      !content.includes('$') &&
      // No null bytes
      !content.includes('\0') &&
      // No excesive white space
      !/\s{4,}/.test(content)
    );
  },
};
