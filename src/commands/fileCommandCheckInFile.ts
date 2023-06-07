import { COMMAND_CHECKIN_FILE } from '../constants';
import { checkFileCommand } from './abstract/createCommand';
 import { 
   removeRemote, upload, 
} from '../fileHandlers';
import { Uri } from 'vscode';
import { uriFromExplorerContextOrEditorContext } from './shared';

export default checkFileCommand({
  id: COMMAND_CHECKIN_FILE,
  getFileTarget: uriFromExplorerContextOrEditorContext,

  async handleFile(ctx) {
    const { target } = ctx;
    const uriParsed = Uri.parse(target.remoteUri.toString());

    const uriLockFile = uriParsed.with({ 
      path: uriParsed.path + '.LCK',
      query: uriParsed.query + '.LCK',
    });

    await upload(ctx, { ignore: null });
    await removeRemote(uriLockFile, { ignore: null });
  },
});
