import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/drizzle')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/demo/drizzle"!</div>
}
