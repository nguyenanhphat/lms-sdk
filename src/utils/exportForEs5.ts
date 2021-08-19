const moduleTemplate: string = `
  "use strict";
  Object.defineProperty(exports, "__esModule", {
      value: true
  });
  exports.default = %s;
`;

export default (content: any): string =>
  moduleTemplate.replace('%s',
    typeof content === 'function' ? 'function() {}' : JSON.stringify(content),
  );
