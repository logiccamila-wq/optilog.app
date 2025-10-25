// Ambient override to relax types from @neondatabase/serverless for local typecheck
declare module '@neondatabase/serverless' {
  export function neon(url: string): any;
  export default neon;
}
