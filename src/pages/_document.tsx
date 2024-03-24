import React from 'react'
import { Html, Head, Main, NextScript, DocumentProps } from 'next/document'
import clsx from 'clsx'
import { z } from 'zod'

const pagePropsScheme = z.object({
  bodyClassName: z.string(),
})

function Document(props: DocumentProps): React.ReactElement {
  const pagePropsResult = pagePropsScheme.safeParse(
    props.__NEXT_DATA__.props?.pageProps,
  )
  return (
    <Html>
      <Head />
      <body
        className={clsx(
          pagePropsResult.success
            ? pagePropsResult.data.bodyClassName
            : undefined,
          'bg-gray-100',
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
