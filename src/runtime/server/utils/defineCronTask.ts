import type { Task, TaskPayload, TaskContext } from 'nitropack/runtime'
import { Cron } from 'croner'

export interface CronTask<RT> extends Task<RT> {
  pattern?: string | Date
}

export function defineCronTask<RT = unknown>(def: CronTask<RT>) {
  const { pattern, ...taskDef } = def
  const nitroApp = useNitroApp()
  const task = defineTask(taskDef)

  if (pattern) {
    const payload: TaskPayload = {
      scheduledTime: Date.now(),
    }
    const context: TaskContext = {}
    const cron = new Cron(pattern, async () => {
      await task.run({ context, payload, name: task.meta?.name || '' })
    })
    nitroApp.hooks.hook('close', () => {
      cron.stop()
    })
  }
}
