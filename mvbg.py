#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import time
import tempfile
import webbrowser
import argparse
import re
from mimetypes import guess_type
from pathlib import Path
from base64 import encodestring

parser = argparse.ArgumentParser(description="mvbg")
parser.add_argument("path")
args = parser.parse_args()
fp = Path(args.path).resolve()

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
    bin = p.read_bytes()
    src = 'data:'
    src += m
    src += ';base64,'
    src += encodestring(bin).decode("utf-8")
    return src

if fp.exists():
    with tempfile.TemporaryDirectory() as tf:
        src = as_data_uri(fp).replace('\n', '')

        html += '<article id="main"><img src="'+src+'"></article>'
        html += '<article id="sub"><img src="'+src+'"></article>'
        html += '<script>'
        html += 'var filename = "' +fp.name+ '";'
        html += '</script>'
        html += add_script('jquery-3.3.1.slim.min.js')
        html += add_script('cropper.min.js')
        html += add_script('cropper.min.css', 'style')
        html += add_script('jquery-cropper.min.js')
        html += add_script('script.js')
        html += '</body>'
        html += '</html>'
        url = Path(str(tf)) / Path("index.html")
        url.write_text(html)
        webbrowser.open(url.as_uri())
        time.sleep(1)
