import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/input", "routes/input.tsx"),
  route("/database", "routes/database.tsx"),
] satisfies RouteConfig;
