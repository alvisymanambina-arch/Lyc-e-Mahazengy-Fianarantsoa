import serverModule from '../dist/server/server.js';

const server = serverModule.default ?? serverModule;

export default async function(request) {
  // Delegate to the compiled server's fetch handler
  return server.fetch ? await server.fetch(request) : new Response('Not implemented', { status: 500 });
}
