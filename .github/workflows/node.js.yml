# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs
# GH_DEBUG=true gh api --method POST -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/repos/ChRakesh27/paper-correction/actions/runs/7699128200/force-cancel

name: Node.js CI

on:
  push:
    branches: ["main"]

jobs:
  build:
    runs-on: self-hosted

    strategy:
      matrix:
        node-version: [18.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: echo "[npm] install in server - start"
      - run: cd server && npm install --verbose
      - run: echo "[npm] install in server - done"
      - run: cd server && touch .env
      - run: cd server && echo '${{ secrets.PROD }}' > .env
      - run: cd server && cat .env
      - run: cd server && pm2 restart Backend
