const routes = {
  home: "/",
} as const;

type Route = (typeof routes)[keyof typeof routes];
const routeNames = Object.values(routes);

function isValidRoute(pathname: string): pathname is Route {
  return routeNames.includes(pathname as Route);
}

export default routes;
export { routeNames, isValidRoute };
export type { Route };
