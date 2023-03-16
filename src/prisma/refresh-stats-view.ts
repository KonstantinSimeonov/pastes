import { db } from "./client"
const USER_STATS_REFRESH_TIME = 60 * 5 // 5 min

export const refreshUserStats = async (force = false) => {
  const meta = await db.metadata.findFirst()
  if (
    !force &&
    meta &&
    (Date.now() - meta.userStatsUpdatedAt.getTime()) / 1000 <
      USER_STATS_REFRESH_TIME
  )
    return

  console.log(`REFRESHING MATERIALIZED VIEW`)
  await db.$executeRaw`REFRESH MATERIALIZED VIEW user_stats`
  const args = { data: { userStatsUpdatedAt: new Date() } }
  return meta ? db.metadata.updateMany(args) : db.metadata.create(args)
}
