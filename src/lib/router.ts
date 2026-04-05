export type Route =
  | "/"
  | "/get-started"
  | "/planner"
  | "/terminology"
  | "/colleges"
  | "/programs"
  | "/advisors"
  | "/agreements"
  | "/faq"
  | "/contact"
  | "/about"

export function navigate(route: Route) {
  window.location.hash = route === "/" ? "" : route
  window.scrollTo({ top: 0, behavior: "smooth" })
}

export function getCurrentRoute(): Route {
  const hash = window.location.hash.replace("#", "")
  if (!hash || hash === "/") return "/"
  return hash as Route
}
