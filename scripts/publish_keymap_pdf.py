"""Publish a run-specific PDF without committing the supplied JSON."""
import base64
import json
import os
import time
import urllib.request
import urllib.error
from pathlib import Path

repo = os.environ['GH_REPO']
run_id = str(int(os.environ['RUN_ID']))
url = f'https://api.github.com/repos/{repo}/contents/downloads/keymaps/{run_id}.pdf'
headers = {'Authorization': 'Bearer ' + os.environ['GH_TOKEN'], 'Accept': 'application/vnd.github+json', 'User-Agent': 'SO-SHO-PDF'}
body = {'message': f'Publish keymap PDF {run_id}', 'content': base64.b64encode(Path('output/pdf/keymap.pdf').read_bytes()).decode(), 'branch': 'main'}
for attempt in range(5):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers, method='PUT')) as response:
            assert response.status in (200, 201)
        break
    except urllib.error.HTTPError as error:
        if error.code not in (409, 422) or attempt == 4:
            raise
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers)) as response:
                body['sha'] = json.load(response)['sha']
        except urllib.error.HTTPError as missing:
            if missing.code != 404:
                raise
        time.sleep(2 + attempt)
