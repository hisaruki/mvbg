#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import time
import tempfile
import argparse
import re
import webbrowser
from mimetypes import guess_type
from pathlib import Path
from base64 import encodebytes
from subprocess import Popen
import os

parser = argparse.ArgumentParser(description="mvbg")
parser.add_argument("paths", nargs="*")
args = parser.parse_args()

html = (Path(__file__).resolve().parent / Path("header.html")).read_text()

def add_script(path, tag='script'):
    html = '<' + tag + '>'
    p = Path(__file__).resolve().parent
    p /= Path(path)
    html += p.read_text()
    html += '</' + tag + '>'
    return html

def as_data_uri(self):
    m, _ = guess_type(re.sub(':.*', '', self.name))
    bin = self.read_bytes()
    if m:
        src = 'data:'
        src += m
        src += ';base64,'
        src += encodebytes(bin).decode("utf-8")
        return src
Path.as_data_uri = as_data_uri

with tempfile.TemporaryDirectory() as tf:
    html += '<article id="main"></article>'

    html += '<article id="sub"></article>'
    html += '<script>'
    html += 'var images = ['
    paths = []
    for fp in filter(lambda x: not re.search('\*', x), args.paths):
        paths.append(Path(fp).resolve())
    
    for wc in filter(lambda x:re.search('\*', x), args.paths):
        wc = Path(wc)
        for fp in wc.parent.glob(wc.name):
            paths.append(Path(fp).resolve())

    for fp in paths:
        src = fp.as_data_uri()
        if not src:
            continue
        html += '"' + src.replace('\n', '') + '",'
    html += '];'
    html += 'var filename = "' +fp.name+ '";\n'
    html += '</script>'
    html += add_script('jquery-3.3.1.slim.min.js')
    html += add_script('cropper.min.js')
    html += add_script('cropper.min.css', 'style')
    html += add_script('jquery-cropper.min.js')
    html += add_script('script.js')
    html += add_script('autohide_mouse.js')
    html += '</body>'
    html += '</html>'
    url = Path(str(tf)) / Path("index.html")
    url.write_text(html)
    userdatadir = Path().home() / Path('.config/viewer')
    if not userdatadir.exists(): userdatadir.mkdir(parents=True)
    chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    if not Path(chrome).exists():
        chrome = "google-chrome-stable"
    Popen([
        chrome,
        '--user-data-dir={}'.format(str(userdatadir)),
        url.as_uri()
    ])
    time.sleep(3)
