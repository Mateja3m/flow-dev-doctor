'use client';

import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import WarningRounded from '@mui/icons-material/WarningRounded';
import { Box, Card, CardContent, Chip, Container, Divider, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';

const sampleChecks = [
  {
    id: 'env.node',
    title: 'Environment readiness',
    status: 'pass',
    message: 'Detected Node.js 22.12.0'
  },
  {
    id: 'config.source',
    title: 'Flow config validation',
    status: 'warn',
    message: 'No config file found. Using safe defaults.'
  },
  {
    id: 'workflow.sample_flow',
    title: 'Sample transaction workflow (bounded)',
    status: 'skip',
    message: 'PoC validates prerequisites only and does not submit a real transaction.'
  }
] as const;

const sampleCliUsage = [
  'flow-doctor doctor env',
  'flow-doctor doctor config',
  'flow-doctor doctor account',
  'flow-doctor doctor network',
  'flow-doctor doctor workflow',
  'flow-doctor doctor report --json'
] as const;

const sampleTextReport = `Flow Dev Doctor (2026-03-11T08:00:00.000Z)\nChecks: 5 | Pass: 3 | Warn: 1 | Fail: 0 | Skip: 1\n\n[PASS] Node.js version\n  Detected Node.js 22.12.0\n[WARN] Faucet configuration hint\n  No faucet endpoint configured for this workspace.\n[SKIP] Sample transaction workflow (bounded)\n  Placeholder validation only: this PoC confirms prerequisites but does not submit a real transaction.`;

const sampleJsonReport = `{
  "result": {
    "chain": "flow",
    "generatedAt": "2026-03-11T08:00:00.000Z",
    "checks": [
      {
        "id": "workflow.sample_flow",
        "title": "Sample transaction workflow (bounded)",
        "status": "skip",
        "message": "Placeholder validation only: this PoC confirms prerequisites but does not submit a real transaction."
      }
    ]
  }
}`;

const statusMeta = {
  pass: { color: 'success', icon: <CheckCircleRounded fontSize="small" /> },
  warn: { color: 'warning', icon: <WarningRounded fontSize="small" /> },
  fail: { color: 'error', icon: <ErrorRounded fontSize="small" /> },
  skip: { color: 'default', icon: <WarningRounded fontSize="small" /> }
} as const;

export default function Page() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        py: 8,
        background:
          'radial-gradient(circle at 0% 0%, rgba(0,82,204,0.12), transparent 35%), radial-gradient(circle at 100% 20%, rgba(0,169,165,0.16), transparent 40%), #f4f7fb'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="overline"
              color="primary"
              sx={{ fontWeight: 700, letterSpacing: '0.08em' }}
            >
              FLOW DEV DOCTOR POC
            </Typography>
            <Typography variant="h2" component="h1" sx={{ mt: 1, maxWidth: 860 }}>
              Minimal diagnostics wrapper for Flow onboarding and local reliability checks
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, maxWidth: 860 }}>
              This demo presents the grant PoC scope: focused checks, structured reports, and a
              clean shared-core + Flow-adapter architecture.
            </Typography>
          </Box>

          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h5">Checks</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    env, config, account, network, workflow (bounded testnet/emulator path)
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h5">Reports</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Human-readable output for developers and JSON output for CI/integration
                    consumers.
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h5">Flow Value</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Reduces setup friction by making common Flow onboarding assumptions explicit and
                    testable.
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Sample Checks
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                {sampleChecks.map((item) => (
                  <Stack
                    key={item.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    sx={{ p: 1.25, borderRadius: 2, bgcolor: 'background.default' }}
                  >
                    <Box>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.message}
                      </Typography>
                    </Box>
                    <Chip
                      icon={statusMeta[item.status].icon}
                      label={item.status.toUpperCase()}
                      color={statusMeta[item.status].color}
                      variant="filled"
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h5">Sample CLI Usage</Typography>
                  <Typography
                    component="pre"
                    sx={{
                      mt: 1.5,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      overflowX: 'auto'
                    }}
                  >
                    {sampleCliUsage.join('\n')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h5">Sample Plain-Text Report</Typography>
                  <Typography
                    component="pre"
                    sx={{
                      mt: 1.5,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      overflowX: 'auto'
                    }}
                  >
                    {sampleTextReport}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h5">Sample JSON Report</Typography>
              <Typography
                component="pre"
                sx={{
                  mt: 1.5,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  overflowX: 'auto'
                }}
              >
                {sampleJsonReport}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
