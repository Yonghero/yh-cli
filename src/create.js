const chalk = require('chalk')
const util = require('util')
const inquirer = require('inquirer')
const downloadGitRepo = require('download-git-repo')
const path = require('path')
const fs = require('fs-extra')
const repoMapping = require('../src/repo-mapping')

module.exports = async function create (projectName, options) {
  
  let { repo } = await new inquirer.prompt([
    {
      name: "repo",
      type: "list",
      message: "Please choose a template",
      choices: [
        { name: 'vue3 + ts', value: 0 },
        { name: 'no-layout-vue3base-tailwind-fuzzynext', value: 1 },
      ],
    },
  ])


  const cwd = process.cwd(); // process.cwd(): 返回是当前执行node命令时候的文件夹地址
  const targetDir = path.resolve(cwd, projectName); // 获取创建项目的地址

  // 当要存在和要创建的项目相同的文件夹时
  if (fs.existsSync(targetDir)) {
    const isCreate = await createInExistTargetDir(targetDir, options)

    if (!isCreate) return
  }

  console.log(chalk.bgCyan.white(`Creating project: ${projectName}`))

  let downloadGitRepoProm = util.promisify(downloadGitRepo)
  await downloadGitRepoProm(`${repoMapping[repo]}`,`${projectName}`, { clone: true })
  console.log(chalk.bgGreen.white(`Created project: ${projectName} Success`))
}

const ActionEnum = {
  Overwrite: 2,
  Cancel: 0,
}

async function createInExistTargetDir(targetDir, options) {

  const { force }  = options
  
  if (force) {
    await fs.remove(targetDir)
    return true
  }

  const { action } = await new inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: chalk.red(
        `Target directory ${targetDir} exists. Choose an action`
      ),
      choices: [
        { name: "Overwrite", value: 2 },
        { name: "Cancel", value: 0 },
      ],
    },
  ])

  //.cancel
  if (!action || action === ActionEnum.Cancel) return false

  if (action === ActionEnum.Overwrite) {
    console.log(chalk.cyan(`Removing ${targetDir}`))
    await fs.remove(targetDir)
    console.log(chalk.green('Removeing Success'))
    return true
  }
}