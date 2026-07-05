# Backup Strategy — MongoDB Atlas

## Automated backups (recommended)

1. Enable **Cloud Backup** on your Atlas M10+ cluster (or use free tier export schedule).
2. Retention: minimum **7 daily**, **4 weekly** snapshots for production.
3. Test restore quarterly to a staging cluster.

## Manual export

```bash
mongodump --uri="mongodb+srv://USER:PASS@CLUSTER.mongodb.net/brainseekers" --out=./backup-$(date +%Y%m%d)
```

## What to back up

| Data | Priority |
|------|----------|
| Users, Students, Parents, Coaches | Critical |
| Leads, Batches, Attendance | Critical |
| Assignments, Reports, Certificates | High |
| Blog, Gallery | Medium |

## Restore procedure

1. Create new Atlas cluster or empty database
2. `mongorestore --uri="..." --db=brainseekers ./backup-folder/brainseekers`
3. Update `MONGODB_URI` on Render if cluster changed
4. Redeploy backend and verify `/health`

## Application-level

- Vercel: deployment history is not data backup
- Render: redeploy previous build; no DB backup
- Store `.env` secrets in team password manager, not in repo

## RPO / RTO targets (suggested)

- **RPO:** 24 hours (daily snapshot)
- **RTO:** 4 hours (restore + redeploy)
