'use client'

import React from 'react'
import type { Time } from 'effects/time'
import { DateTime } from 'luxon'

export type CurrentTimeProps = {
  time: Time
}

function CurrentTime({ time }: CurrentTimeProps): React.ReactElement {
  return (
    <span className="font-thin">
      {time.now().toLocaleString(DateTime.DATETIME_FULL)}
    </span>
  )
}

export default CurrentTime
