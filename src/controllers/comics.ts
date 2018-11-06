const clear = require('clear');
import * as inquirer from 'inquirer';
import { db } from '../db';
import chalk from 'chalk';
import * as figlet from 'figlet';
import InteractiveTableView, {
  IListFunctionArgs,
} from '../views/InteractiveTableView';
import TableView from '../views/TableView';
import { comics } from '../utils';
import {
  comicsPrompts,
  randomizeEntitiesPromptItems,
  ComicsModes,
} from './prompts';

export async function start() {
  clear();
  console.log(
    chalk.redBright(figlet.textSync('Comics', { font: 'Isometric3' })),
  );
  while (true) {
    const answers: any = await inquirer.prompt(comicsPrompts.menu);
    switch (answers.mode) {
      case ComicsModes.SEARCH:
        await search();
        break;
      case ComicsModes.LIST:
        await interactiveList();
        break;
      case ComicsModes.CREATE:
        await createComics();
        break;
      case ComicsModes.RANDOMIZE:
        await randomize();
        break;
      case ComicsModes.DROP:
        await empty();
        break;
      case ComicsModes.BACK:
        return;
    }
  }
}

async function createComics() {
  const answers: any = await inquirer.prompt(comicsPrompts.create);
  console.log(TableView.buildTable([await db.comics.insertOne(answers)]));
}

async function listComics({ offset, limit }: IListFunctionArgs) {
  const list = await db.comics.list({ offset, limit });
  const total = await db.comics.total();
  clear();
  console.log(TableView.buildTable(list));
  console.log(
    chalk.cyan('total:'),
    total,
    chalk.red('limit:'),
    limit,
    chalk.magenta('offset:'),
    offset,
  );
}

function interactiveList() {
  return InteractiveTableView.display(listComics, 0, 10);
}

async function randomize() {
  const answers: any = await inquirer.prompt(randomizeEntitiesPromptItems);
  const comicsRandomData = Array.from(
    { length: answers.count },
    comics.randomData,
  );
  console.log(
    TableView.buildTable(await db.comics.insertMany(comicsRandomData)),
  );
}

async function empty() {
  const answers: any = await inquirer.prompt({
    name: 'confirm',
    type: 'confirm',
  });
  if (answers.confirm) {
    console.log(TableView.buildTable(await db.comics.empty()));
  }
}

async function search() {
  const answers: any = await inquirer.prompt(comicsPrompts.search);
  console.log(
    TableView.buildTable(await db.comics.fts(answers.query), {
      maxLength: 0,
    }),
  );
}
