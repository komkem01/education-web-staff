export default defineNuxtRouteMiddleware((to) => {
  const authToken = useCookie<string | null>('edu_staff_token')

  const isPublic = to.path === '/'

  if (!authToken.value && !isPublic) {
    return navigateTo('/')
  }

  if (authToken.value && isPublic) {
    return navigateTo('/staff')
  }
})
