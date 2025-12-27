export function getAnonUserId() {
  let id = localStorage.getItem("anon_user_id")

  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("anon_user_id", id)
  }

  return id
}
