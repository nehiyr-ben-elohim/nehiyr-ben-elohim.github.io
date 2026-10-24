export default process => {
  if (process.isClient) {
    process.store.dispatch('projects/fetch')
    process.store.dispatch('activities/fetch')
  }
}
