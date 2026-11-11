#!/usr/bin/env python3
"""Verification runner for Coltrane. See SKILL.md."""
import json, os, re, subprocess, sys, time, urllib.request
from pathlib import Path
REPO = Path(__file__).resolve().parents[3]
failures = []
def check(name, ok, detail=''):
    print(('PASS' if ok else 'FAIL'), name, (':: ' + str(detail))[:400] if detail else '')
    if not ok: failures.append(name)
def run(cmd, **kw):
    return subprocess.run(cmd, cwd=REPO, capture_output=True, text=True, timeout=600, **kw)
def main():
    if not (REPO / 'node_modules').is_dir():
        check('npm install', run(['npm', 'install', '--no-audit', '--no-fund']).returncode == 0)
    proc = run(['node', '--test', 'test/app.test.js', 'test/predictive.test.js'])
    tail = proc.stdout + proc.stderr
    m = re.search(r'# fail (\d+)', tail)
    check('node --test suites (app + predictive)', proc.returncode == 0 and m and m.group(1) == '0', tail[-300:])
    server = subprocess.Popen(['node', '-e', "require('./src/server').listen(0, function(){console.log(this.address().port)})"], cwd=REPO, stdout=subprocess.PIPE, text=True)
    try:
        port = int(server.stdout.readline().strip())
        data = json.loads(urllib.request.urlopen('http://127.0.0.1:%d/api/health' % port, timeout=5).read())
        check('server boots and /api/health operational', data.get('status') == 'operational', data)
    except Exception as e:
        check('server boots and /api/health operational', False, e)
    finally:
        server.terminate()
    print('FAILURES=%d' % len(failures))
    with open(REPO / '.cursor/skills/verify-coltrane/evidence.json', 'w') as f:
        json.dump({'repo': 'Coltrane', 'ts': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'failures': failures}, f, indent=2)
    return 1 if failures else 0
if __name__ == '__main__':
    sys.exit(main())
