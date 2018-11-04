import { sql } from '../../../../utils/index';
import { IBaseSqlQueryTree } from '../../BaseModel';
import { QueryFile } from 'pg-promise';

export interface IComicsSqlQueryTree extends IBaseSqlQueryTree {
  fullTextSearch: QueryFile;
}
const tree: IComicsSqlQueryTree = sql.loadSqlFromDir(__dirname);
export default tree;
