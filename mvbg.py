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
parser.add_argument("path", nargs="*")
args = parser.parse_args()

html = (Path(__file__).resolve().parent / Path("header.html")).read_text()

def add_script(path, tag='script'):
    html = '<' + tag + '>'
    p = Path(__file__).resolve().parent
    p /= Path(path)
    html += p.read_text()
    html += '</' + tag + '>'
    return html

def as_data_uri(p):
    m, e = guess_type(re.sub(':.*', '', p.name))
    print(m, e)
    bin = p.read_bytes()
    src = 'data:'
    src += m
    src += ';base64,'
    src += encodebytes(bin).decode("utf-8")
    return src

with tempfile.TemporaryDirectory() as tf:
    html += '<article id="main"></article>'

    html += '<article id="sub"></article>'
    html += '<script>'
    html += 'var images = ['
    for fp in args.path:
        fp = Path(fp).resolve()
        src = as_data_uri(fp).replace('\n', '')
        html += '"' + src + '",'
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
