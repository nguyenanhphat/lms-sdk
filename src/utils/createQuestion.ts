import * as inquirer from 'inquirer';

export const createQuestion = (question: inquirer.Answers): Promise<any> =>
  inquirer.prompt([question]).then(answer => answer);
