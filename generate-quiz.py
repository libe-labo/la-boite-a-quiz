#!/usr/bin/env python

from __future__ import print_function  # In case we're running with python2

import argparse
import os
import requests
import re
import sys
import pystache
import random


class Sheet():
    def __init__(self, key):
        self.__endpoint = 'https://spreadsheets.google.com'
        self.__key = key

        self.__data = list()

        try:
            path = '/feeds/worksheets/{key}/public/basic?alt=json'.format(
                key=key)
            for entry in self.__requestData(path)['feed']['entry']:
                path = '/feeds/list/{key}/{sheetId}/public/values?alt=json'\
                    .format(key=key,
                            sheetId=entry['link'][len(entry['link']) - 1]
                                         ['href'].split('/').pop())

                self.__setData(self.__formatData([
                    {key[4:]: value['$t']
                        for key, value in entry.items()
                        if key[:4] == 'gsx$'}
                    for entry in self.__requestData(path)['feed']['entry']]))

        except requests.exceptions.RequestException as e:
            print(e, file=sys.stderr)

    def __requestData(self, path):
        r = requests.get(self.__endpoint + path)
        if r.status_code == 200:
            return r.json()
        raise requests.exceptions.RequestException(
            "Seems we can't find {0}".format(self.__key))

    def __setData(self, data):
        self.__data = data

    def __formatData(self, data):
        def getOrFalse(d, k):
            return len(d[k]) > 0 and dict(value=d[k].encode('utf-8')) or False

        def addNBSPs(s):
            for char in ['?', ':', '!']:
                s = s.replace(' {0}'.format(char), '&nbsp;{0}'.format(char))
            return s

        return [dict(
            title=addNBSPs(d['titre']).encode('utf-8'),
            text=getOrFalse(d, 'texte'),
            picture=getOrFalse(d, 'image'),
            okText=dict(
                title=d['textebonnereponse'].split('\n')[0].encode('utf-8'),
                text='\n'.join(d['textebonnereponse'].split('\n')[1:])
                .encode('utf-8')
            ),
            koText=dict(
                title=d['textemauvaisereponse'].split('\n')[0].encode('utf-8'),
                text='\n'.join(d['textemauvaisereponse'].split('\n')[1:])
                .encode('utf-8')
            ),
            ok=d['bonnereponse'],
            answers=sorted(
                [dict(text=value.encode('utf-8'),
                      id=int(key.replace('reponse', '')))
                    for key, value in d.items()
                    if re.match('^reponse[0-9]+$', key) and len(value) > 0],
                key=lambda d: d['id'])
        ) for d in data]

    def getData(self):
        return self.__data

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('key', metavar='key', type=str)
    parser.add_argument('--dest', type=str)
    parser.add_argument('--src', type=str)
    args = parser.parse_args()

    templateDir = os.path.dirname(os.path.realpath(__file__))
    templateDir = os.path.join(templateDir, 'src')
    if args.src is not None:
        templateDir = os.path.realpath(args.src)
    destDir = os.path.join(templateDir, 'dist')
    if args.dest is not None:
        destDir = os.path.realpath(args.dest)
    if not os.path.isdir(destDir):
        os.mkdir(destDir)

    with open(os.path.join(destDir, 'index.html'), 'w') as f:
        with open(os.path.join(templateDir, 'template.html'), 'r') as template:
            f.write(pystache.render(template.read(),
                                    dict(questions=Sheet(args.key).getData())))

    # TODO : Minify and copy .js and .css files from templateDir to destDir
