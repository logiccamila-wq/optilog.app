// Polyfills para o ambiente Node durante o build
globalThis.self = globalThis.self || globalThis;
globalThis.window = globalThis.window || globalThis;
globalThis.document = globalThis.document || {
  createElement: () => ({
    setAttribute: () => {},
    getElementsByTagName: () => [],
    appendChild: () => {}
  }),
  head: { appendChild: () => {} },
  querySelector: () => null,
  querySelectorAll: () => []
};
