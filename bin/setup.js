#!/usr/bin/env node

const program = require('commander')
const create = require('../src/create')

program
  .command('create <name>')
  .description('请输入项目名称')
  .option("-f, --force", "Overwrite target directory if it exists")
  .action(async(name, options) => {
    create(name, options)
  })

program.parse(process.argv)