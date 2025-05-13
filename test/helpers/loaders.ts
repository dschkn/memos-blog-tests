import * as fs from 'fs';

export default class Loaders {

    async ensureFileExists(filePath: string) {
        try {
          await fs.promises.access(filePath, fs.constants.F_OK);
        } catch (err) {
          throw new Error(`File not found: ${filePath}`);
        }
      }

}