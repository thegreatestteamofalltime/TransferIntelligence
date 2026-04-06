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
  | "/search"

export function navigate(route: Route, params?: Record<string, string>) {
  let hash = route === "/" ? "" : route
  if (params) {
    const qs = new URLSearchParams(params).toString()
    if (qs) hash += `?${qs}`
  }
  window.location.hash = hash
  window.scrollTo({ top: 0, behavior: "smooth" })
}

export function getCurrentRoute(): Route {
  const hash = window.location.hash.replace("#", "").split("?")[0]
  if (!hash || hash === "/") return "/"
  return hash as Route
}

export function getHashParams(): Record<string, string> {
  const hash = window.location.hash.replace("#", "")
  const qIndex = hash.indexOf("?")
  if (qIndex === -1) return {}
  const qs = hash.slice(qIndex + 1)
  return Object.fromEntries(new URLSearchParams(qs).entries())
}
