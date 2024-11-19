import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <link href="/static/newmap.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
})
